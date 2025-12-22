import React from "react";
import ReportForm from "./components/ReportForm";
import CsvUpload from "./components/CsvUpload";
import Dashboard from "./components/Dashboard";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light"
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">NGO Reporting App</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }} elevation={2}>
              <ReportForm />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, mb: 2 }} elevation={2}>
              <CsvUpload />
            </Paper>
            <Paper sx={{ p: 2 }} elevation={2}>
              <Dashboard />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
