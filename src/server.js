import express from 'express'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import sequelize from './config/database.js'
import doctors from './routes/doctors.js'
import appointments from './routes/appointments.js'
import admin from './routes/admin.js'
import procedures from './routes/procedures.js'
import cors from 'cors'

dotenv.config()

const app = express()


app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json())
app.use("/auth", auth)
app.use("/doctors", doctors)
app.use("/appointments", appointments)
app.use("/admin", admin)
app.use("/procedures", procedures)

const PORT = process.env.PORT


sequelize.sync({ force: false })
    .then(() => {
        console.log('Banco de dados sincronizado!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
})
.catch(err => console.error('Erro ao sincronizar o banco de dados:', err));
