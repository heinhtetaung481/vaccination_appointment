import axios from "axios"

import { base_url } from './config'

const appointment_url = base_url + "/appointments/"

const get = async () => {
    // console.log("here")
    let res = await axios.get(appointment_url)
    // console.log(res.data)
    return res.data
}

const getId = async (id) => {
  let res = await axios.get(appointment_url + id);
  return res.data;
};

const create = async (formData) => {
  let res = await axios.post(appointment_url + "create", {
    client_ic: formData.client_ic,
    client_name: formData.client_name,
    appointment_date: formData.dateSlot,
    time_slot: formData.time,
    vaccination_center: formData.vaccination_center,
    status: "pending",
  });
  return res.data;
};

const deleteAppointment = (id) => {
  console.log(id);
  axios.delete(appointment_url + id);
};

const getAvailableTimeSlots = async (date, vc_center) => {
  let res = await axios.post(appointment_url + "get_available_slots", {
    date: date,
    vaccination_center: vc_center,
  });
  console.log(res.data);
  return res.data;
}

const update = async (formData) => {
    console.log("formData", formData)
    let res = axios.put(appointment_url + formData._id, formData)
    return res.data
}

const Appointments = {
  get,
  getId,
  create,
  getAvailableTimeSlots,
  deleteAppointment,
  update
};
export default Appointments