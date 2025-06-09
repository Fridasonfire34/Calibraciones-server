const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.get('/historicoTransportador', async (req, res) => {
        try {
            const pool = await sql.connect(config);
            await pool.request().query(`
                INSERT INTO Historico (
                    [ID Equipo], [Fecha], [DIM 1], [DIM 2], [DIM 3], [DIM 4], [DIM 5], [DIM 6], [DIM 7], [Comentarios], [Patron]
                )
                SELECT
                    ID, [Ultima Calibracion], [Dim 1], [Dim 2], [Dim 3], [Dim 4], [Dim 5], [Dim 6], [Dim 7], Comentarios, [Patron de Verificacion]
                FROM
                    [Transportador]
                WHERE
                    [Calibrado] = 'OK';
                
                UPDATE [Transportador]
                SET
                [Ultima Calibracion] = NULL,
                [Dim 1] = NULL,
                [Dim 2] = NULL,
                [Dim 3] = NULL,
                [Dim 4] = NULL,
                [Dim 5] = NULL,
                [Dim 6] = NULL,
                [Dim 7] = NULL,
                Comentarios= NULL, [Patron de Verificacion] = NULL,
                    [Calibrado] = NULL,
                    [Estatus] = NULL,
                    [Siguiente Calibracion] = NULL
                WHERE
                    [Calibrado] = 'OK';
            `);
            await pool.request().query(`
                SELECT * FROM Historico ORDER BY Fecha ASC;
            
                UPDATE E
                SET
                    E.[Ultima Calibracion Trans] = H.Fecha,
                    E.[Siguiente Calibracion Trans] = DATEADD(DAY, 60, H.Fecha)
                FROM
                    Equipos E
                INNER JOIN (
                    SELECT [ID Equipo], MAX(Fecha) AS Fecha
                    FROM Historico
                    GROUP BY [ID Equipo]
                ) H ON E.Transportador = H.[ID Equipo];
            `);


            res.status(200).send('Datos procesados correctamente');
        } catch (err) {
            console.error('Error al procesar los datos:', err);
            res.status(500).send('Error al procesar los datos');
        }
    });

    return router;
};