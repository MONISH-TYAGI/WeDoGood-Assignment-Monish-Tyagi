import React, { useState } from "react";
import api from "../api";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid
} from "@mui/material";

function Dashboard() {
    console.log("issue fix")
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);

  const load = async () => {
    try {
      const res = await api.get(`/dashboard?month=${month}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Month (YYYY-MM)"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
        <Button variant="contained" onClick={load}>
          Load
        </Button>
      </Box>

      {data && Object.keys(data).length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Total NGOs</Typography>
                <Typography variant="h5">{data.totalNGOs || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">People Helped</Typography>
                <Typography variant="h5">{data.peopleHelped || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Events</Typography>
                <Typography variant="h5">{data.eventsConducted || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Funds</Typography>
                <Typography variant="h5">{data.fundsUtilized || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : data ? (
        <Typography color="textSecondary">No data found for this month</Typography>
      ) : null}
    </Box>
  );
}

export default Dashboard;
