import {
  Table,
  Box,
  Button,
  CssBaseline,
  Collapse,
  IconButton,
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { Component } from "react";

import { VaccinationCenters } from '../../api'


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        key={row._id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell scope="row">
          {row.location}
        </TableCell>
        <TableCell align="left">{row.daily_max_capacity}</TableCell>
        <TableCell align="left">
          <Button component={Link} to={'/bookings/' + row._id}>
            <ModeEditIcon />
          </Button>
          <Button onClick={() => props.deleteVaccinationCenter(row._id)}>
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              Nurses
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Shift</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.nurses.map((nurse) => (
                  <TableRow key={nurse._id}>
                    <TableCell component="th" scope="row">
                      {nurse.name}
                    </TableCell>
                    <TableCell>{nurse.shift}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </React.Fragment>
  );
}


export class VaccinationCenterListing extends Component {
  state = {
    vaccinationCenters: [],
  }

  async componentWillMount(){
    let vaccinationCenters = await VaccinationCenters.get()
    this.setState(state => ({ vaccinationCenters }))
  }

  deleteVaccinationCenter = async (id) => {
    VaccinationCenters.deleteVaccinationCenter(id)
    let vaccinationCenters = this.state.vaccinationCenters.filter(v_center => {
      if (v_center._id !== id) return v_center
    })
    this.setState(state => ({vaccinationCenters: vaccinationCenters}))
    // console.log(id)
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box sx={{mt: 8}}>
            <Typography component="h1" variant="h5">
              Vaccination Centers
            </Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">&nbsp;</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Daily Max Capacity</TableCell>
                    {/* <TableCell>Appointment Date</TableCell>
                    <TableCell align="left">Time Slot</TableCell>
                    <TableCell align="left">Status</TableCell> */}
                    <TableCell align="left">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.vaccinationCenters.map((row) => (
                    <Row key={row._id} row={row} deleteVaccinationCenter={this.deleteVaccinationCenter}/>
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
