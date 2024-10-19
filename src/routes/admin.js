import express from 'express'
import User from '../model/User.js'
import { isAdmin, checkToken } from './auth.js'

const router = express.Router()


router.put("/setadmin/:id", checkToken, isAdmin,async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findOne({ where: { id: id } })
    
        if(!user) {
            res.send({ msg: 'Usuario não encontrado!' })
        }

        await user.update({
            role: 'admin'
        })

        res.send({ msg: 'cargo atualizado com sucesso!' })

    } catch(error) {
        console.lof(error)
        res.send({ msg: 'Erro ao atribuir cargo!' })
    }
})

router.put("/setuser/:id", checkToken, isAdmin, async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findOne({ where: { id: id } })
    
        if(!user) {
            res.send({ msg: 'Usuario não encontrado!' })
        }

        await user.update({
            role: 'user'
        })

        res.send({ msg: 'cargo atualizado com sucesso!' })

    } catch(error) {
        console.lof(error)
        res.send({ msg: 'Erro ao atribuir cargo!' })
    }
})

export default router