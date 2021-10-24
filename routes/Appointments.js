import express from "express"
const router = express.Router() 

import { Appointments } from "../controllers/index.js"

router.get('/', Appointments.get)
router.get("/:id", Appointments.getId);
router.delete('/:id', Appointments.deleteAppointment)
router.post('/get_available_slots', Appointments.getAvailableTimeSlots)
router.post('/create', Appointments.create)
router.put('/:id', Appointments.update)

export default router
