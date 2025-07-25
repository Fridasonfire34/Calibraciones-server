const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.get('/vernier12', async (req, res) => {
        try {
            await sql.connect(config);

            const result = await sql.query("SELECT ID FROM [Vernier 12] WHERE [Calibrado] IS NULL ");

            res.json(result.recordset);
        } catch (err) {
            console.error('Error al obtener los datos de la tabla Vernier 12:', err);
            res.status(500).send('Error al obtener los datos de la tabla Vernier 6');
        }
    });

    return router;
};
