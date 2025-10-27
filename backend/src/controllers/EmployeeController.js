import Insumos from "../models/Insumos.js";
import z from "zod";

class EmployeeController {
    static async sendRequest(req, res) {
        const { id } = req.params;

        try {
            const current_weight_carga = Insumos.findByPk(id)



        } catch (error) {

        }
    }
}

export default EmployeeController;