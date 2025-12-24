import express from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

import connectDB from "./db.js";
import Report from "./models/Report.js";
import Job from "./models/Job.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "src/uploads/" });
app.post("/report", async (req, res) => {
  const reportData = {
    ngoId: req.body.ngoId,
    month: req.body.month,
    peopleHelped: parseInt(req.body.peopleHelped) || 0,
    eventsConducted: parseInt(req.body.eventsConducted) || 0,
    fundsUtilized: parseInt(req.body.fundsUtilized) || 0
  };
  await Report.findOneAndUpdate(
    { ngoId: req.body.ngoId, month: req.body.month },
    reportData,
    { upsert: true }
  );
  res.json({ message: "Report submitted" });
});
app.post("/reports/upload", upload.single("file"), async (req, res) => {
  const jobId = uuidv4();
  await Job.create({
    jobId,
    totalRows: 0,
    processedRows: 0,
    failedRows: 0,
    status: "PROCESSING"
  });

  const rows = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", d => rows.push(d))
    .on("end", async () => {
      await Job.updateOne({ jobId }, { totalRows: rows.length });

      for (const r of rows) {
        try {
            console.log("db2->"+r.ngoId+"-"+r.month+"-"+r.peopleHelped+"-"+r.events+"-"+r.funds);
          const reportData = {
            ngoId: r.ngoId,
            month: r.month,
            peopleHelped: parseInt(r.peopleHelped) || 0,
            eventsConducted: parseInt(r.events) || 0,
            fundsUtilized: parseInt(r.funds) || 0
          };
        //   console.log("Parsed reportData:", reportData);
        
          await Report.findOneAndUpdate(
            { ngoId: r.ngoId, month: r.month },
            reportData,
            { upsert: true }
          );
          await Job.updateOne({ jobId }, { $inc: { processedRows: 1 } });
        } catch {
          await Job.updateOne({ jobId }, { $inc: { failedRows: 1 } });
        }
      }

      await Job.updateOne({ jobId }, { status: "COMPLETED" });
    });

  res.json({ jobId });
});
app.get("/job-status/:id", async (req, res) => {
  const job = await Job.findOne({ jobId: req.params.id });
  res.json(job);
});
app.get("/dashboard", async (req, res) => {
  const month = req.query.month;

  const data = await Report.aggregate([
    { $match: { month } },
    {
      $group: {
        _id: null,
        ngos: { $addToSet: "$ngoId" },
        peopleHelped: { $sum: "$peopleHelped" },
        eventsConducted: { $sum: "$eventsConducted" },
        fundsUtilized: { $sum: "$fundsUtilized" }
      }
    }
  ]);

  if (!data.length) return res.json({});
  res.json({
    totalNGOs: data[0].ngos.length,
    peopleHelped: data[0].peopleHelped,
    eventsConducted: data[0].eventsConducted,
    fundsUtilized: data[0].fundsUtilized
  });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log("Backend running on port 4000")
);
