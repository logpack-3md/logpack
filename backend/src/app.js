import 'dotenv/config'
import express from 'express';
import cors from 'cors'

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

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})