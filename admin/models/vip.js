let db = require('../configDb');

module.exports.getVipInfos = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT * FROM vip`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}