import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema({
    vaccination_center: String,
    client_name: String,
    client_ic: String,
    appointment_date: String,
    time_slot: String,
    status: String
})

const Appointments = mongoose.model("appointments", AppointmentSchema)
export default Appointments