import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
} from "@mui/material";
import { Link } from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { Component } from "react";

import { Appointments } from '../../api'


export class VaccineRegistrationListing extends Component {
  state = {
    appointments: []
  }

  async componentWillMount(){
    let appointments = await Appointments.get()
    console.log("component", appointments)
    this.setState(state => ({ appointments: appointments}))
  }

  deleteAppointment = async (id) => {
    Appointments.deleteAppointment(id)
    let appointments = this.state.appointments.filter(appointment => {
      if (appointment._id !== id) return appointment
    })
    this.setState(state => ({appointments: appointments}))
    // console.log(id)
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box sx={{mt: 8}}>
            <Typography component="h1" variant="h5">
              Active Booking
            </Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>NRIC</TableCell>
                    <TableCell>Center Name</TableCell>
                    <TableCell>Appointment Date</TableCell>
                    <TableCell align="left">Time Slot</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.appointments.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.client_name}
                      </TableCell>
                      <TableCell scope="row">
                        {row.client_ic}
                      </TableCell>
                      <TableCell align="left">{row.vaccination_center}</TableCell>
                      <TableCell align="left">
                        {row.appointment_date}
                      </TableCell>
                      <TableCell align="left">
                        {row.time_slot}
                      </TableCell>
                      <TableCell align="left">
                        {row.status}
                      </TableCell>
                      <TableCell align="left">
                        <Button component={Link} to={'/bookings/' + row._id}>
                          <ModeEditIcon />
                        </Button>
                        <Button onClick={() => this.deleteAppointment(row._id)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
