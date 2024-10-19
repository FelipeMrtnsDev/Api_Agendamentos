import express from 'express'
import dotenv from 'dotenv'
import auth from './src/routes/auth.js'
import sequelize from './src/config/database.js'
import doctors from './src/routes/doctors.js'
import appointments from './src/routes/appointments.js'
import admin from './src/routes/admin.js'
import procedures from './src/routes/procedures.js'

dotenv.config()

const app = express()

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
