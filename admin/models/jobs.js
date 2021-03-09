let db = require('../configDb');

module.exports.getAgences = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT AGENCE_NUMERO AS id, AGENCE_NOM AS agence FROM agence`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}
