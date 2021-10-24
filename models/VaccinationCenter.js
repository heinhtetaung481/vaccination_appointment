import mongoose from "mongoose"

const VaccinationCenterSchema = new mongoose.Schema({
    name: String,
    location: String,
    daily_max_capacity: Number,
    nurses:[
        {
            name: String,
            shift: String
        }
    ]
})

const VaccinationCenters = mongoose.model('vaccination_centers', VaccinationCenterSchema)
export default VaccinationCenters