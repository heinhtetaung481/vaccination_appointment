import { Appointments } from "../models/index.js";
import { VaccinationCenters } from "../models/index.js";

const get = async (req, res) => {
    try{
        let appointments = await Appointments.find()
        res.status(200).json(appointments)
    }catch (err){
        res.status(404).json({message: err.message})
    }
}

const getId = async (req, res) => {
  let id = req.params.id;
  try {
    let appointment = await Appointments.findById(id);
    res.status(200).json(appointment);
  } catch (err) {
    res.status(200).json({ message: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  let id = req.params.id;
  // console.log(id)
  try {
    let appointment = await Appointments.findByIdAndDelete(id);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(200).json({ message: err.message });
  }
};

const getAvailableTimeSlots = async (req, res) => {
  let date = req.body.date;
  let vaccination_center = req.body.vaccination_center;
  // need to check if date value is not null or invalid value
  let total_count = (
    await Appointments.find({
      appointment_date: date,
      vaccination_center: vaccination_center,
    })
  ).length;
  let daily_max_capacity = (
    await VaccinationCenters.find({ name: vaccination_center })
  )[0].daily_max_capacity;
  console.log("daily", daily_max_capacity);
  console.log("total", total_count);
  if (total_count >= daily_max_capacity) {
    res.status(200).json({ available_slot: false });
  } else {
    let slots = [
      "7:00am",
      "8:00am",
      "9:00am",
      "10:00am",
      "11:00am",
      "12:00pm",
      "1:00pm",
      "2:00pm",
      "3:00pm",
      "4:00pm",
      "5:00pm",
      "6:00pm",
      "7:00pm",
    ];
    res.status(200).json({ available_slot: true, slots: slots });
  }
  // console.log(total_count)
};

const create = async (req, res) => {
  let body = req.body;
  // validate parameters before using
  let result = await Appointments.find({
    client_name: body.client_name,
    client_ic: body.client_ic,
  });
  console.log(result);

  if (result.length !== 0) {
    console.log(result.length);
    res.status(200).json({ message: "Existing appointments" });
  } else {
    try {
      let newAppointment = new Appointments(body);
      await newAppointment.save();
      res.status(200).json({ message: "Your appoinment created" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
};

const update = async (req, res) => {
    let id = req.params.id
    let body = req.body
    console.log('body', body)
    try{
        let appointment = await Appointments.findByIdAndUpdate(id, body)
        res.status(200).json({message: "Updated successfully"})
    }catch(err){
        res.status(200).json({message: err.message})
    }
}

export default {
  get,
  getId,
  deleteAppointment,
  getAvailableTimeSlots,
  create,
  update
};