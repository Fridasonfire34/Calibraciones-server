const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.get('/historicoFlex', async (req, res) => {
        try {
            const pool = await sql.connect(config);

<<<<<<< HEAD
=======
            const result = await pool.request().query(`
                SELECT COUNT(*) AS total 
                FROM Flexometros 
                WHERE [Calibrado] = 'OK' AND [Siguiente Calibracion] >= GETDATE();
            `);

            const totalOK = result.recordset[0].total;

            if (totalOK === 0) {
                return res.status(200).send('No hay equipos calibrados válidos para procesar.');
            }

>>>>>>> 82b6ea8 (ultimos cambios para deploy)
            await pool.request().query(`
                INSERT INTO Historico (
                    [ID Equipo], [Fecha], [DIM 1], [DIM 2], [DIM 3], [DIM 4], [DIM 5], [DIM 6], [DIM 7], [Comentarios], [Patron]
                )
                SELECT
                    [ID], [Ultima Calibracion], [Dim 1], [Dim 2], [Dim 3], [Dim 4], [Dim 5], [Dim 6], [Dim 7], [Comentarios], [Patron de Verificacion]
                FROM
                    Flexometros
                WHERE
<<<<<<< HEAD
                    [Calibrado] = 'OK'
                    AND [Ultima Calibracion] <= DATEADD(MONTH, -3, GETDATE());
            `);

            await pool.request().query(`
=======
                    [Calibrado] = 'OK' AND [Siguiente Calibracion] >= GETDATE();
                
>>>>>>> 82b6ea8 (ultimos cambios para deploy)
                UPDATE Flexometros
                SET
                    [Ultima Calibracion] = NULL,
                    [Dim 1] = NULL,
                    [Dim 2] = NULL,
                    [Dim 3] = NULL,
                    [Dim 4] = NULL,
                    [Dim 5] = NULL,
                    [Dim 6] = NULL,
                    [Dim 7] = NULL,
<<<<<<< HEAD
                    [Comentarios] = NULL,
=======
                    Comentarios = NULL,
>>>>>>> 82b6ea8 (ultimos cambios para deploy)
                    [Patron de Verificacion] = NULL,
                    [Calibrado] = NULL,
                    [Estatus] = NULL,
                    [Siguiente Calibracion] = NULL
                WHERE
<<<<<<< HEAD
                    [Calibrado] = 'OK'
                    AND [Ultima Calibracion] <= DATEADD(MONTH, -3, GETDATE());
            `);

            const result = await pool.request().query(`
                SELECT [ID] FROM Flexometros WHERE [Calibrado] IS NULL
            `);

            res.status(200).json({
                mensaje: 'Datos procesados correctamente',
                equiposFaltantes: result.recordset
            });

=======
                    [Calibrado] = 'OK' AND [Siguiente Calibracion] >= GETDATE();
            `);

            await pool.request().query(`
                UPDATE F
                SET
                    F.[Ultima Calibracion] = H.Fecha,
                    F.[Siguiente Calibracion] = DATEADD(DAY, 60, H.Fecha)
                FROM
                    Flexometros F
                INNER JOIN (
                    SELECT [ID Equipo], MAX(Fecha) AS Fecha
                    FROM Historico
                    GROUP BY [ID Equipo]
                ) H ON F.ID = H.[ID Equipo];
            `);

            res.status(200).send('Datos procesados correctamente');
>>>>>>> 82b6ea8 (ultimos cambios para deploy)
        } catch (err) {
            console.error('Error al procesar los datos:', err);
            res.status(500).send('Error al procesar los datos');
        }
    });

    return router;
};
