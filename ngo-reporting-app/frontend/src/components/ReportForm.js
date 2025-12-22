import React, { useState } from "react";
import api from "../api";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography
} from "@mui/material";

function ReportForm() {
  const [form, setForm] = useState({
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsConducted: "",
    fundsUtilized: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    try {
      setSubmitting(true);
      await api.post("/report", form);
      alert("Report submitted");
      setForm({ ngoId: "", month: "", peopleHelped: "", eventsConducted: "", fundsUtilized: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Submit Monthly Report
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="NGO ID"
          value={form.ngoId}
          onChange={e => setForm({ ...form, ngoId: e.target.value })}
          fullWidth
        />
        <TextField
          label="Month (YYYY-MM)"
          value={form.month}
          onChange={e => setForm({ ...form, month: e.target.value })}
          fullWidth
        />
        <TextField
          label="People Helped"
          type="number"
          value={form.peopleHelped}
          onChange={e => setForm({ ...form, peopleHelped: e.target.value })}
          fullWidth
        />
        <TextField
          label="Events Conducted"
          type="number"
          value={form.eventsConducted}
          onChange={e => setForm({ ...form, eventsConducted: e.target.value })}
          fullWidth
        />
        <TextField
          label="Funds Utilized"
          type="number"
          value={form.fundsUtilized}
          onChange={e => setForm({ ...form, fundsUtilized: e.target.value })}
          fullWidth
        />
        <Button variant="contained" onClick={submit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Stack>
    </Box>
  );
}

export default ReportForm;
