let db = require('../configDb');

module.exports.profile = function(vip_id, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT PHOTO_ADRESSE AS path FROM photo WHERE PHOTO_NUMERO=1 AND VIP_NUMERO=" + connexion.escape(vip_id) + ";";
            // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};
