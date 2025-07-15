const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.get('/historicoTransportador', async (req, res) => {
        try {
            const pool = await sql.connect(config);

            const result = await pool.request().query(`
                SELECT COUNT(*) AS total 
                FROM Transportador 
                WHERE [Calibrado] = 'OK' AND [Siguiente Calibracion] >= GETDATE();
            `);

            const totalOK = result.recordset[0].total;

            if (totalOK === 0) {
                return res.status(200).send('No hay equipos calibrados válidos para procesar.');
            }

            await pool.request().query(`
                INSERT INTO Historico (
                    [ID Equipo], [Fecha], [DIM 1], [DIM 2], [DIM 3], [Comentarios], [Patron]
                )
                SELECT
                    ID, [Ultima Calibracion], [Dim 1], [Dim 2], [Dim 3], Comentarios, [Patron de Verificacion]
                FROM
                    Transportador
                WHERE
                    [Calibrado] = 'OK' AND [Siguiente Calibracion] >= GETDATE();
                
                UPDATE Transportador
                SET
                    [Ultima Calibracion] = NULL,
                    [Dim 1] = NULL,
                    [Dim 2] = NULL,
                    [Dim 3] = NULL,
                    Comentarios = NULL,
                    [Patron de Verificacion] = NULL,
                    [Calibrado] = NULL,
                    [Estatus] = NULL,
                    [Siguiente Calibracion] = NULL
                WHERE
                    [Calibrado] = 'OK' AND [Siguiente Calibracion] >= GETDATE();
            `);

            await pool.request().query(`
                UPDATE T
                SET
                    T.[Ultima Calibracion] = H.Fecha,
                    T.[Siguiente Calibracion] = DATEADD(DAY, 60, H.Fecha)
                FROM
                    Transportador T
                INNER JOIN (
                    SELECT [ID Equipo], MAX(Fecha) AS Fecha
                    FROM Historico
                    GROUP BY [ID Equipo]
                ) H ON T.ID = H.[ID Equipo];
            `);

            res.status(200).send('Datos procesados correctamente');
        } catch (err) {
            console.error('Error al procesar los datos:', err);
            res.status(500).send('Error al procesar los datos');
        }
    });

    return router;
};
