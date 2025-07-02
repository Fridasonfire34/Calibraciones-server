const express = require('express');
const sql = require('mssql');

module.exports = (config) => {
    const router = express.Router();

    router.post('/calibracionBascula', async (req, res) => {
        const {
            equipo,
            fecha,
            dimensiones,
            estatus,
            patron,
            comentarios,
            siguienteCalibracion
        } = req.body;

        try {
            const pool = await sql.connect(config);

            const result = await pool.request()
                .input('ID', sql.VarChar(255), equipo)
                .query('SELECT [ID] FROM Bascula WHERE [ID] = @ID');

            if (result.recordset.length > 0) {
                await pool.request()
                    .input('ID', sql.VarChar(255), equipo)
                    .input('UltimaCalibracion', sql.Date, fecha)
                    .input('Dim1', sql.Float, parseFloat(dimensiones[0]))
                    .input('Dim2', sql.Float, parseFloat(dimensiones[1]))
                    .input('Dim3', sql.Float, parseFloat(dimensiones[2]))
                    .input('Estatus', sql.VarChar(255), estatus)
                    .input('Comentarios', sql.VarChar(255), comentarios)
                    .input('Patron', sql.VarChar(255), patron)
                    .input('SiguienteCalibracion', sql.Date, siguienteCalibracion)
                    .query(`
                        UPDATE Bascula
                        SET
                            [Ultima Calibracion] = @UltimaCalibracion,
                            [Dim 1] = @Dim1,
                            [Dim 2] = @Dim2,
                            [Dim 3] = @Dim3,
                            [Estatus] = @Estatus,
                            [Comentarios] = @Comentarios,
                            [Patron de Verificacion] = @Patron,
                            [Siguiente Calibracion] = @SiguienteCalibracion,
                            [Calibrado] = 'OK'
                        WHERE [ID] = @ID
                    `);

                return res.status(200).json({ message: 'Datos procesados correctamente' });
            } else {
                return res.status(404).send('Equipo no encontrado');
            }
        } catch (err) {
            console.error('Error al procesar los datos:', err);
            return res.status(500).send('Error al procesar los datos');
        }
    });

    return router;
};
