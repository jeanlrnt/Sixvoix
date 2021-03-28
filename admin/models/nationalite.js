let db = require('../configDb');

/**
 * @param callback
 */
module.exports.getNationalites = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT NATIONALITE_NUMERO AS id, NATIONALITE_NOM AS nationalite FROM nationalite`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}