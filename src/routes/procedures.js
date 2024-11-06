import express from 'express'
import Procedures from '../model/Procedures.js'
import Doctors from '../model/Doctors.js'
import { checkToken, isAdmin } from './auth.js'

const router = express.Router()

router.get("/", checkToken, async (req, res) => {
    try {
        const procedures = await Procedures.findAll({
            attributes: {exclude: [ 'createdAt', 'updatedAt' ] } 
        })
        res.status(200).json( procedures )

    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: "Erro ao listar procedimentos!" })
    }
})

router.get("/:id", checkToken, async (req, res) => {
    const id = req.params.id;

    try {
        const procedures = await Procedures.findAll({ where: { doctor_id: id } });

        if (procedures.length > 0) {
            res.status(200).json(procedures);
        } else {
            res.status(404).json({ message: "No procedures found for this doctor" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post("/register", checkToken, isAdmin, async (req, res) => {
    const { name, price, doctor_id } = req.body;

    if (!name) {
        return res.status(400).json({ msg: 'Dê um nome ao procedimento!' });
    }

    if (!price) {
        return res.status(400).json({ msg: 'Dê um preço ao procedimento!' });
    }

    if (!doctor_id) {
        return res.status(400).json({ msg: 'Atribua o procedimento a algum doutor!' });
    }

    const procedureAlreadyExists = await Procedures.findOne({ where: { name: name, doctor_id: doctor_id } });

    if (procedureAlreadyExists) {
        return res.status(400).json({ msg: 'Procedimento já existe!' });
    }

    const doctorExists = await Doctors.findOne({ where: { id: doctor_id } });
    if (!doctorExists) {
        return res.status(404).json({ msg: 'Médico não encontrado!' });
    }

    const procedure = new Procedures({
        name,
        price,
        doctor_id
    });

    try {
        await procedure.save();
        return res.status(201).json({ msg: 'Procedimento cadastrado com sucesso!', procedure });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'A requisição não deu certo' });
    }
});

router.delete("/:id", checkToken, isAdmin, async (req, res) => {
    const id = req.params.id

    try {
        await Procedures.destroy({ where: { id: id } })
        res.status(200).json({ msg: "Procedimento excluido com sucesso!" })
    } catch(error) {
        console.log(error)
        res.send({ msg: 'Não foi possivel excluir o procedimento!' })
    }
})


router.put("/update/:id", async (req, res) => {
    const { id } = req.params; 
    const { name, price, doctor_id } = req.body;

    try {
        const procedure = await Procedures.findOne({ where: { id: id } });

        if (!procedure) {
            return res.status(404).json({ msg: "Procedimento não encontrado!" });
        }

        if (doctor_id) {
            const doctor = await Doctors.findOne({ where: { id: doctor_id } });
            if (!doctor) {
                return res.status(422).json({ msg: "Doutor não registrado!" });
            }
        }

        await procedure.update({
            name: name || procedure.name,  
            price: price || procedure.price, 
            doctor_id: doctor_id || procedure.doctor_id
        });

        return res.status(200).json({ msg: "Procedimento atualizado com sucesso!", procedure });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro ao atualizar Procedimento", error });
    }
})


export default router
