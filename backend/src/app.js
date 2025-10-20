import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import userRoute from './routes/userRoute.js';
import admRoute from './routes/admRoute.js';
import { initializeDatabase } from './database/sequelize.js'

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor ligado' })
})

app.use('/users', userRoute)
app.use('/admin', admRoute)

async function startServer() {
    try {
        await initializeDatabase();

        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });

    } catch (error) {
        console.error("Não foi possível iniciar o servidor devido ao erro no DB:", error);
        process.exit(1);
    }
}

startServer();