import express from "express"
const router = express.Router();

import { VaccinationCenters } from '../controllers/index.js'

/* GET users listing. */
router.get('/', VaccinationCenters.get);
router.delete('/:id', VaccinationCenters.deleteVaccinationCenters)

export default router
