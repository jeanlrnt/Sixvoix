let db = require('../configDb');

module.exports.getNationalites = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT NATIONALITE_NUMERO AS id, NATIONALITE_NOM AS nationalite FROM nationalite`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}