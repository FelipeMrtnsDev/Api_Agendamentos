import Appointments from "../model/Appointments.js";
import Doctors from "../model/Doctors.js";
import express from 'express'
import { checkToken, isAdmin } from "./auth.js";
import User from "../model/User.js";
import Procedures from "../model/Procedures.js";

const router = express.Router()

router.get("/", checkToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const appointments = await Appointments.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Doctors,
                    attributes: ['id', 'name', 'area', 'gender' ],
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                }
            ]
        });

        if (appointments.length === 0) {
            return res.status(404).json({ msg: 'Não foram encontradas consultas referentes ao usuário!' });
        }

        const appointmentsWithDoctorInfos = appointments.map(async (appointment) => {
            const doctorInfos = await Doctors.findOne({
                where: { id: appointment.doctor_id },
                attributes: ['id', 'name', 'area', 'gender'] 
            });

            return {
                ...appointment.toJSON(), 
                doctor: doctorInfos, 
            };
        });

        const finalAppointments = await Promise.all(appointmentsWithDoctorInfos);

        res.status(200).json(finalAppointments);
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        res.status(500).json({ msg: 'Erro ao buscar agendamentos' });
    }
});

router.get("/:id", checkToken, async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    if (!appointmentId) {
        return res.status(404).json({ msg: 'Consulta não encontrada' });
    }

    try {
        const appointment = await Appointments.findOne({
            where: { id: appointmentId },
            include: [
                {
                    model: Doctors,
                    attributes: ['id', 'name', 'area'],
                },
                {
                    model: User, 
                    as: 'usuario',
                    attributes: ['id', 'name', 'email'],
                }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ msg: 'Consulta não encontrada' });
        }

        if (appointment.usuario.id !== userId) {
            return res.status(403).json({ msg: 'Acesso negado. Você não pode acessar essa consulta.' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Erro ao buscar consulta:", error);
        res.status(500).json({ msg: 'Erro ao buscar consulta' });
    }
});

router.post("/register", checkToken, async (req, res) => {
    const { date, time, doctor_id, procedure_id } = req.body;
    const userId = req.user.id

    console.log(doctor_id, procedure_id)

    if (!doctor_id) {
        return res.status(404).json({ msg: 'Selecione um doutor!' });
    }

    if (!userId) {
        return res.status(404).json({ msg: 'Usuario não encontrado!' });
    }

    
    const appointmentAlreadyMarked = await Appointments.findOne({
        where: { date, time, doctor_id }
    });
    
    if (appointmentAlreadyMarked) {
        return res.status(404).json({ msg: 'Já há uma consulta marcada nesse horário!' });
    }

    const procedureAlreadyExist = await Procedures.findOne({
        where: { doctor_id, id: procedure_id }
    });

    if (!procedureAlreadyExist) {
        return res.status(404).json({ msg: 'Não existe um serviço vinculado a esse doutor!' });
    }

    const doctorIdExist = await Doctors.findOne({ where: { id: doctor_id } });
    
    if (!doctorIdExist) {
        return res.status(422).json({ msg: 'Doutor não registrado!' });
    }
    
    const userIdExist = await User.findOne({ where: { id: userId } });
    
    if (!userIdExist) {
        return res.status(422).json({ msg: 'Usuario não registrado!' });
    }

    
    const appointment = new Appointments({
        date,
        time,
        topic: procedureAlreadyExist.name,
        doctor_id,
        user_id: userId 
    });
    
    try {
        await appointment.save();
        return res.status(200).json({ msg: 'Consulta agendada com sucesso!', appointment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Algo deu errado', error });
    }
});

router.delete("/delete/:id", checkToken, async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    try {
        const appointment = await Appointments.findOne({ where: { id: appointmentId } });

        if (!appointment) {
            return res.status(404).json({ msg: 'Consulta não encontrada' });
        }

        if (appointment.user_id !== userId) {
            return res.status(403).json({ msg: 'Acesso negado. Você não pode cancelar esta consulta.' });
        }

        await Appointments.destroy({ where: { id: appointmentId } });

        res.status(200).json({ msg: 'Consulta cancelada com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar a consulta:", error);
        res.status(500).json({ msg: 'Erro ao deletar a consulta' });
    }
});

router.put("/update/:id", checkToken, isAdmin, async (req, res) => {
    const { id } = req.params; 
    const { date, time, topic, doctor_id } = req.body;

    try {
        const appointment = await Appointments.findOne({ where: { id: id } });

        if (!appointment) {
            return res.status(404).json({ msg: "Agendamento não encontrado!" });
        }

        if (doctor_id) {
            const doctor = await Doctors.findOne({ where: { id: doctor_id } });
            if (!doctor) {
                return res.status(404).json({ msg: "Doutor não registrado!" });
            }
        }

        await appointment.update({
            date: date || appointment.date,  
            time: time || appointment.time, 
            topic: topic || appointment.topic,
            doctor_id: doctor_id || appointment.doctor_id
        });

        return res.status(200).json({ msg: "Agendamento atualizado com sucesso!", appointment });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro ao atualizar agendamento", error });
    }
});

export default router
