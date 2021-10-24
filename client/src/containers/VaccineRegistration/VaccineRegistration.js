import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Alert,
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import React, { useEffect, useState } from "react";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import moment from "moment";
import { Appointments, VaccinationCenters } from "../../api";

export default function VaccineRegistration(props) {
  const [vcCenter, setVcCenter] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [regDate, setDate] = useState(new Date());
  const [formData, setFormData] = useState({
    client_ic: "",
    client_name: "",
    vaccination_center: "",
    dateSlot: regDate.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    time: "",
  });
  const [message, setMessage] = useState("");

  async function getVaccinationCenter() {
    let vaccinationCenter = await VaccinationCenters.get();
    setVcCenter(vaccinationCenter);
  }

  async function getTimeSlot(date, vc_center) {
    let timeSlots = await Appointments.getAvailableTimeSlots(date, vc_center);
    console.log(timeSlots);
    setTimeSlots(timeSlots);
  }

  useEffect(() => {
    getVaccinationCenter();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "vaccination_center") {
      getTimeSlot(formData.dateSlot, e.target.value);
    }
  }

  function handleDate(val) {
    setDate(val);
    setFormData({
      ...formData,
      dateSlot: moment(val).format("DD-MM-YYYY"),
    });
    console.log(moment(val).format("DD-MM-YYYY"), formData.vaccination_center);
    if (formData.vaccination_center !== "") {
      getTimeSlot(
        moment(val).format("DD-MM-YYYY"),
        formData.vaccination_center
      );
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    await Appointments.create(formData)
      .then((res) => {
        setMessage(res.message);
        setFormData({
          ...formData,
          client_ic: "",
          client_name: "",
          vaccination_center: "",
          time: "",
        });
        setDate(new Date());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box
          sx={{
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Book a slot
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, display: "block" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="client_ic"
                label="NRIC Number"
                name="client_ic"
                autoComplete="client_ic"
                onChange={handleChange}
                value={formData.client_ic}
                sx={{ mb: 2 }}
                autoFocus
              />
            </FormControl>
            <FormControl sx={{ m: 1, display: "block" }}>
              <TextField
                required
                fullWidth
                id="client_name"
                label="Full Name"
                name="client_name"
                autoComplete="client_name"
                onChange={handleChange}
                value={formData.client_name}
                sx={{ mb: 2 }}
              />
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120, display: "block" }}>
              <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
              <Select
                labelId="vaccineCenterLabel"
                label="Vaccine Center"
                required
                fullWidth
                id="vaccineCenter"
                name="vaccination_center"
                value={formData.vaccination_center}
                onChange={handleChange}
                sx={{ mb: 2 }}
              >
                {vcCenter.map((v) => {
                  return (
                    <MenuItem key={v._id} value={v.name}>
                      {v.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Grid container spacing={1} paddingRight={2}>
              <Grid item sm={6}>
                <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Date"
                      name="dateTime"
                      disablePast
                      value={regDate}
                      onChange={(obj) => {
                        handleDate(obj);
                      }}
                      required
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item sm={6}>
                <FormControl sx={{ m: 1, mr: 4, minWidth: 120, width: "100%" }}>
                  <InputLabel id="timeSlotLabel">Time Slot</InputLabel>
                  <Select
                    labelId="timeSlotLabel"
                    label="Time Slot"
                    required
                    fullWidth
                    id="time"
                    name="time"
                    placeholder="None"
                    value={formData.time}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  >
                    {timeSlots.slots &&
                      timeSlots.slots.map((v, index) => {
                        return (
                          <MenuItem key={index} value={v}>
                            {v}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                {timeSlots.available_slot === false ? (
                  <Alert severity="error">
                    Full appointment for the selected date
                  </Alert>
                ) : null}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register!
            </Button>
          </form>
          {message ? (
            <Alert
              severity={`${
                message === "Existing appointments" ? "warning" : "success"
              }`}
            >
              {message}
            </Alert>
          ) : null}
        </Box>
      </Container>
    </React.Fragment>
  );
}