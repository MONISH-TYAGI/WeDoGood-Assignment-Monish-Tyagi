import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: String,
  totalRows: Number,
  processedRows: Number,
  failedRows: Number,
  status: String
});

export default mongoose.model("Job", jobSchema);
