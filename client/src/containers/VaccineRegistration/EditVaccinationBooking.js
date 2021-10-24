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
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import React, { useEffect, useState } from "react";
import moment from "moment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import { useParams, Redirect } from "react-router";
import { VaccinationCenters, Appointments } from "../../api";

export default function VaccineRegistration(props) {
  const { bookingId } = useParams();
  const [regDate, setDate] = useState(new Date());
  const [formData, setFormData] = useState({
    _id: "",
    vaccination_center: "",
    appointment_date: moment(regDate, "DD-MM-YYYY"),
    client_ic: "",
    client_name: "",
    time_slot: "",
  });
  const [vcCenter, setVcCenter] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  async function getVaccinationCenter() {
    let vaccinationCenter = await VaccinationCenters.get();
    setVcCenter(vaccinationCenter);
    console.log(vaccinationCenter);
  }

  async function getTimeSlot(date, vc_center) {
    let timeSlots = await Appointments.getAvailableTimeSlots(date, vc_center);
    console.log(timeSlots);
    setTimeSlots(timeSlots);
  }

  useEffect(() => {
    async function fetchAppointments() {
      let appointments = await Appointments.getId(bookingId);
      console.log(appointments);
      setFormData(appointments);
      setDate(moment(appointments.appointment_date));
      getTimeSlot(
        appointments.appointment_date,
        appointments.vaccination_center
      );
    }
    fetchAppointments();
    getVaccinationCenter();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleDate(val) {
    setDate(val);
    setFormData({
      ...formData,
      appointment_date: moment(val).format("DD-MM-YYYY"),
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    await Appointments.update(formData)
      .then((res) => {
        // todo: validate res
        // history.push("/bookings")
        window.location.href = "/bookings"
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
                {vcCenter &&
                  vcCenter.map((v) => {
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
                      label="Slot"
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
                    name="time_slot"
                    placeholder="None"
                    value={formData.time_slot}
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
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleSubmit}
            >
              Register!
            </Button>
          </form>
        </Box>
      </Container>
    </React.Fragment>
  );
}
