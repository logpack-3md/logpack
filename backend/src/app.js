import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import userRoute from './routes/userRoute.js';
import admRoute from './routes/admRoute.js';
import managerRoute from './routes/managerRoute.js';

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
app.use('/manager', managerRoute)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});