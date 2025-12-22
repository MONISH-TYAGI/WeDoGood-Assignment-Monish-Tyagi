import React, { useState } from "react";
import api from "../api";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Stack
} from "@mui/material";

function CsvUpload() {
  const [job, setJob] = useState(null);
  const [uploading, setUploading] = useState(false);

  const upload = async e => {
    if (!e.target.files[0]) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      setUploading(true);
      const res = await api.post("/reports/upload", formData);
      const jobId = res.data.jobId;
      setJob({ jobId, status: "PENDING", processedRows: 0, totalRows: 0, failedRows: 0 });

      const interval = setInterval(async () => {
        try {
          const status = await api.get(`/job-status/${jobId}`);
          setJob(status.data);
          if (status.data.status === "COMPLETED" || status.data.status === "FAILED") {
            clearInterval(interval);
            setUploading(false);
          }
        } catch (err) {
          console.error(err);
          clearInterval(interval);
          setUploading(false);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bulk CSV Upload
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="contained" component="label">
          Choose CSV
          <input hidden accept=".csv" type="file" onChange={upload} />
        </Button>
        {uploading && <Typography>Uploading...</Typography>}
      </Stack>

      {job && (
        <Box sx={{ mt: 2 }}>
          <Typography>
            Status: {job.status} {job.totalRows ? ` — ${job.processedRows}/${job.totalRows}` : ""}
          </Typography>
          <LinearProgress
            variant={job.totalRows ? "determinate" : "indeterminate"}
            value={job.totalRows ? (job.processedRows / job.totalRows) * 100 : undefined}
            sx={{ mt: 1 }}
          />
          <Typography sx={{ mt: 1 }}>Failed: {job.failedRows || 0}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default CsvUpload;
