import express from "express";
import dotenv from 'dotenv';
import { checkToken, isAdmin } from "./auth.js";
import User from "../model/User.js";

dotenv.config()

const router = express.Router()

router.get("/", checkToken, isAdmin, async (req, res) => {
  const users = await User.findAll();

  if (!users || users.length === 0) {
      return res.status(400).json({ message: "Nenhum usuário encontrado!" });
  }

  res.status(200).json(users);
});

export default router