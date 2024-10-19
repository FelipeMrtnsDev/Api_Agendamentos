import express from 'express'
import Doctors from '../model/Doctors.js'
import { checkToken, isAdmin } from './auth.js'

const router = express.Router()

router.post("/register", checkToken, isAdmin, async (req, res) => {
    const { gender, name, area } = req.body

    const doctorExist = await Doctors.findOne({ where: {name: name} })

    if(doctorExist) {
        res.status(222).json({ msg: "O doutor ja existe!" })
    }

    const doctor = new Doctors({
        gender,
        name,
        area,
    })


    try {
        await doctor.save()
        res.status(401).json({ msg: "Doutor criado com sucesso!"})
    } catch(error) {
        res.send({ msg: 'deu errado' })
    }
})

router.get("/", checkToken, async (req, res) => {
    const allDoctors = await Doctors.findAll()
    res.status(401).json({ allDoctors })
})

router.get("/:id", checkToken, async (req, res) => {
    const id = req.params

    const doctor = await Doctors.findOne(id)
    res.status(401).json({ doctor })
})

router.delete("/:id", checkToken, isAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const Doctor = await Doctors.destroy({ where: { id: id } })
        res.status(200).json({ msg: 'Doutor removido com sucesso!', Doctor})
    } catch(error) {
        console.log(error)
        res.status(422).json({ msg: "Não foi possivel remover o usuário!" })
    }
})

router.put("/update/:id", checkToken, isAdmin, async (req, res) => {
    const { id } = req.params; 
    const { gender, name, area } = req.body; 

    try {
        const doctor = await Doctors.findOne({ where: { id: id } });

        if (!doctor) {
            return res.status(404).json({ msg: "Médico não encontrado!" });
        }

        await doctor.update({
            gender: gender || doctor.gender, 
            name: name || doctor.name,
            area: area || doctor.area,
        });

        return res.status(200).json({ msg: "Médico atualizado com sucesso!", doctor });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao atualizar médico", error });
    }
});

export default router