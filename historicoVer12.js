const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.get('/historicoVer12', async (req, res) => {
        try {
            const pool = await sql.connect(config);

            await pool.request().query(`
                INSERT INTO Historico (
                    [ID Equipo], [Fecha], [DIM 1], [DIM 2], [DIM 3], [DIM 4], [DIM 5], [DIM 6], [Comentarios], [Patron]
                )
                SELECT
                    [ID], [Ultima Calibracion], [Dim 1], [Dim 2], [Dim 3], [Dim 4], [Dim 5], [Dim 6], [Comentarios], [Patron de Verificacion]
                FROM
                    [Vernier 12]
                WHERE
                    [Calibrado] = 'OK'
                    AND [Ultima Calibracion] <= DATEADD(MONTH, -3, GETDATE());
            `);

            await pool.request().query(`
                UPDATE [Vernier 12]
                SET
                    [Ultima Calibracion] = NULL,
                    [Dim 1] = NULL,
                    [Dim 2] = NULL,
                    [Dim 3] = NULL,
                    [Dim 4] = NULL,
                    [Dim 5] = NULL,
                    [Dim 6] = NULL,
                    [Comentarios] = NULL,
                    [Patron de Verificacion] = NULL,
                    [Calibrado] = NULL,
                    [Estatus] = NULL,
                    [Siguiente Calibracion] = NULL
                WHERE
                    [Calibrado] = 'OK'
                    AND [Ultima Calibracion] <= DATEADD(MONTH, -3, GETDATE());
            `);

            const result = await pool.request().query(`
                SELECT [ID] FROM [Vernier 12] WHERE [Calibrado] IS NULL
            `);

            res.status(200).json({
                mensaje: 'Datos procesados correctamente',
                equiposFaltantes: result.recordset
            });

        } catch (err) {
            console.error('Error al procesar los datos:', err);
            res.status(500).send('Error al procesar los datos');
        }
    });

    return router;
};
