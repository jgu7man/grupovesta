'use strict';

var express = require('express');
var router = express.Router();
var sql = require('mssql');

router.post('/saveGrupoPersona', function(req, res, next) {
    const body = req.body;
    const request = new sql.Request();


    // GET TODAY
    const today = new Date().toISOString();
    const dateSplit = today.split('T');
    const date = dateSplit[0].toString();

    // GET LAST INDEX
    request.query('SELECT * FROM GrupoPersona', function(err, result) {
        if (err) { return next(err); }
        var rec = result.recordset;
        var newId = rec[rec.length - 1].Id + 1;


        // SAVE DATA
        var campos = 'Id, GrupoPersona, CreatedDate, ModifiedDate, CreatedBy, ModifiedBy';
        request.query(
            `SET IDENTITY_INSERT GrupoPersona ON
            INSERT INTO GrupoPersona (${campos}) 
            VALUES (
                ${newId},
                '${body.GrupoPersona}',
                '${date}',
                '${date}',
                ${body.CreatedBy},
                ${body.ModifiedBy}
                )
                SET IDENTITY_INSERT GrupoPersona OFF `,

            function(err, result) {
                if (err) {
                    console.log(err);
                    return res.status(200).send({
                        mensaje: 'Hubo un error al guardar',
                        tipo: 'warning',
                        error: err
                    });
                }
                var data = {};
                data = result.recordset;
                console.log(data);
                return res.status(200).send({
                    mensaje: 'Grupo Persona agregado con éxito',
                    tipo: 'succsess'
                });
            });
    });
});

router.post('/updateGrupoPersona', function(req, res, next) {

    const body = req.body;
    const request = new sql.Request();

    // GET TODAY
    const today = new Date().toISOString();
    const dateSplit = today.split('T');
    const date = dateSplit[0].toString();


    request.query(
        `
        UPDATE GrupoPersona SET
            GrupoPersona = '${body.GrupoPersona}',
            ModifiedDate = '${date}',
            ModifiedBy = ${body.ModifiedBy}
        WHERE Id = ${body.Id}
        `,

        function(err, result) {
            if (err) {
                console.log(err);
                // Se puede personalizar el mensaje más no el tipo
                return res.status(200).send({
                    mensaje: 'Hubo un error al guardar',
                    tipo: 'warning'
                });
            }
            var data = {};
            data = result.recordset;
            console.log(data);
            // Se puede personalizar el mensaje más no el tipo
            return res.status(200).send({
                mensaje: 'Grupo Persona editado con éxito',
                tipo: 'succsess'
            });
        }
    );
});

module.exports = router;