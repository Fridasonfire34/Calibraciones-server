const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.get('/flexometros', async (req, res) => {
        try {
            await sql.connect(config);

            const result = await sql.query("SELECT ID FROM [Flexometros] WHERE [Calibrado] IS NULL");

            res.json(result.recordset);
        } catch (err) {
            console.error('Error al obtener los datos de la tabla Flexometros:', err);
            res.status(500).send('Error al obtener los datos de la tabla Flexometros');
        }
    });

    return router;
};
