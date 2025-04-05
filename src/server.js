import express from 'express'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import doctors from './routes/doctors.js'
import appointments from './routes/appointments.js'
import admin from './routes/admin.js'
import procedures from './routes/procedures.js'
import users from "./routes/users.js"
import cors from 'cors'
import neonDB from './config/database.js'

dotenv.config()

const app = express()

const allowedOrigins = [
    'http://localhost:3000', 
    'https://agendei.vercel.app', 
];

app.use(express.json())
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
}));

app.use("/auth", auth)
app.use("/doctors", doctors)
app.use("/appointments", appointments)
app.use("/admin", admin)
app.use("/procedures", procedures)
app.use("/users", users)

app.get("/", (req, res) => {
    res.send("API is running...")
})

neonDB.authenticate()
.then(() => {
    console.log('Conexão com o Neon PostgreSQL estabelecida com sucesso!');
})
.catch((err) => {
    console.error('Erro ao conectar com o banco:', err);
});

export default app