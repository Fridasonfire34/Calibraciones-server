const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.get('/transportador', async (req, res) => {
        try {
            const pool = await sql.connect(config);

            const result = await pool.request().query(`
                SELECT ID FROM [Transportador]
                WHERE [Calibrado] IS NULL
                ORDER BY Nomina ASC
            `);

            res.json(result.recordset);
        } catch (err) {
            console.error('Error al obtener los datos de la tabla Transportador:', err);
            res.status(500).send('Error al obtener los datos de la tabla Transportador');
        }
    });

    router.get('/transportador/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pool = await sql.connect(config);

            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .query(`
                    SELECT [Siguiente Calibracion]
                    FROM [Transportador]
                    WHERE ID = @id
                `);

            if (result.recordset.length === 0) {
                return res.status(404).send('Equipo no encontrado');
            }

            res.json(result.recordset[0]);
        } catch (err) {
            console.error('Error al obtener la Siguiente Calibración:', err);
            res.status(500).send('Error al obtener la Siguiente Calibración');
        }
    });

    return router;
};
