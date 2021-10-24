import { VaccinationCenters } from "../models/index.js";

const get = async (req, res) => {
    try{
        let vaccination_centers = await VaccinationCenters.find()
        res.status(200).json(vaccination_centers)
    }catch (err){
        res.status(404).json({message: err.message})
    }
}

const deleteVaccinationCenters = async (req, res) => {
    let id = req.params.id
    console.log(id)
    try{
        let v_center = await VaccinationCenters.findByIdAndDelete(id)
        res.status(201).json(v_center)
    }catch(err){
        res.status(200).json({message: err.message})
    }
}

export default {
    get,
    deleteVaccinationCenters
}