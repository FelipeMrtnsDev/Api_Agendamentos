import express from "express";
import bcrypt from 'bcrypt';
import User from "../model/User.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const router = express.Router()

export const checkToken = (req, res, next) => { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' });
    }

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expirado!' });
        } else {
            return res.status(400).json({ msg: 'Token inválido!' });
        }
    }
};

export const isAdmin = (req, res, next) => { 
    if(req.user.role !== 'admin') {
        return res.status(403).json({ msg: "Acesso restrito para administradores." })
    }

    next()
}

router.get("/user/:id", checkToken, isAdmin, async (req, res) => {
    const id = req.params.id

    const user = await User.findByPk(id, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });

    if(!user) {
        return res.status(440).json({ msg: 'Usuário não encontrado' })
    }

    res.status(200).json({ user })
})

router.post("/login", async (req, res) => {
    const { password, email } = req.body

    if(!email) {
        return res.status(422).json({ msg: "email obrigatório!" })
    }

    if(!password) {
        return res.status(422).json({ msg: "senha obrigatória" })
    }


    const user = await User.findOne({ where: { email: email } })

    if (!user) {
        return res.status(422).json({ msg: 'email inválido!' })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({ msg: "senha inválida!" })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            secret,
            { expiresIn: '1h' }
        );
        res.status(200).json({ msg: 'Autentificação realizada com sucesso', token})
    } catch(err) {
        console.log(err)
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
        })
    }
})

router.post("/register", async (req, res) => {

    const { email, password, name, confirmpassword } = req.body

    if(!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" })
    }

    if(!email) {
        return res.status(422).json({ msg: "O email é obrigatório!"})
    }

    if(!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!"})
    }

    if(password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!'})
    }

    const userExist = await User.findOne({ where: { email: email } })

    if(userExist) {
        res.status(422).json({ msg: "O usuario ja existe!" })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash,
        role: 'user'
    })

    try {
        await user.save()
        res.status(201).json({ msg: 'Usuário criado com sucesso!'})
    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente Novamete mais tarde" })
    }
})

export default router

