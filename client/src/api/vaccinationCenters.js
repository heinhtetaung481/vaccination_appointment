import axios from 'axios'

import { base_url } from "./config"

const v_center_url = base_url + "/vaccination_centers/"

const get = async () => {
    let res = await axios.get(v_center_url)
    return res.data
}

const deleteVaccinationCenter = async id =>  axios.delete(v_center_url + id)

const VaccinationCenters = {
    get,
    deleteVaccinationCenter
}

export default VaccinationCenters