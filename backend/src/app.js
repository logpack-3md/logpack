import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import userRoute from './routes/userRoute.js';
import admRoute from './routes/admRoute.js';
import managerRoute from './routes/managerRoute.js';
import insumoRoute from './routes/insumoRoute.js';
import setorRoute from './routes/setorRoute.js';
import employeeRoute from './routes/employeeRoute.js';
import buyerRoute from './routes/buyerRoute.js';

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

app.use('/users', userRoute) // funções gerais que todos usuários podem usar
app.use('/admin', admRoute) // liberação de usuários
app.use('/manager', managerRoute) // todas funções que envolvem insumos e setores
app.use('/employee', employeeRoute) // funções de solicitação
app.use('/insumos', insumoRoute) // apenas get
app.use('/setor', setorRoute) // apenas get
app.use('/buyer', buyerRoute) // criação de orçamento

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});