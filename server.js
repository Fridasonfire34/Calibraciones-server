require('dotenv').config();

const express = require('express');
const sql = require('mssql')

const loginRoutes = require('./login');
const historicoFlexRoutes = require('./historicoFlex');
const historicoVerRoutes = require('./historicoVer');
const historicoVer12Routes = require('./historicoVer12');
const historicoTransportadorRoutes = require('./historicoTransportador');
const flexometrosRoutes = require('./flexometros');
const transportadorRoutes = require('./transportador');
const vernierRoutes = require('./vernier');
const vernier12Routes = require('./vernier12');
const calibracionFlexRoutes = require('./calibracionFlex');
const calibracionVerRoutes = require('./calibracionVer');
const calibracionVer12Routes = require('./calibracionVer12');
const calibracionTransRoutes = require('./calibracionTrans');
const calibracionBasculaRoutes = require('./calibracionBascula');
const calibracionMicroRoutes = require('./calibracionMicro');
const historicoOtrosRoutes = require('./historicoOtros');
const OtrosRoutes = require('./Otros');
const calibracionEspesorRoutes = require('./calibracionEspesor');


const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.get('/test-db', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT TOP 1 * FROM [Usuarios]');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error de conexión:', err);
        res.status(500).send('Error de conexión a la base de datos');
    }
});

app.get('/', (req, res) => {
    res.send('Servidor de Calibraciones funcionando correctamente 🚀');
});


app.use('/api', loginRoutes(config));
app.use('/api', vernierRoutes(config));
app.use('/api', vernier12Routes(config));
app.use('/api', flexometrosRoutes(config));
app.use('/api', transportadorRoutes(config));
app.use('/api', historicoFlexRoutes(config));
app.use('/api', historicoVerRoutes(config));
app.use('/api', historicoVer12Routes(config));
app.use('/api', historicoTransportadorRoutes(config));
app.use('/api', calibracionFlexRoutes(config));
app.use('/api', calibracionVerRoutes(config));
app.use('/api', calibracionVer12Routes(config));
app.use('/api', calibracionTransRoutes(config));
app.use('/api', historicoOtrosRoutes(config));
app.use('/api', calibracionBasculaRoutes(config));
app.use('/api', calibracionMicroRoutes(config));
app.use('/api', OtrosRoutes(config));
app.use('/api', calibracionEspesorRoutes(config));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
