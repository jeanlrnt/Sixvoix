let db = require('../configDb');

module.exports.getPhotoProfile = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = `SELECT v.VIP_NUMERO AS id, PHOTO_ADRESSE AS path 
                        FROM photo p 
                            JOIN vip v ON v.VIP_NUMERO = p.VIP_NUMERO 
                        WHERE PHOTO_NUMERO = 1 
                        ORDER BY v.VIP_NOM`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPhotoVip = function(id, callback) {

    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = `SELECT CONCAT(VIP_PRENOM, ' ', VIP_NOM) as vip,
                           v.VIP_NUMERO as idVip,
                           PHOTO_NUMERO as id,
                           PHOTO_SUJET as sujet,
                           PHOTO_COMMENTAIRE as comment,
                           PHOTO_ADRESSE as path
                        FROM photo p 
                            JOIN vip v ON v.VIP_NUMERO = p.VIP_NUMERO
                        WHERE v.VIP_NUMERO=${id}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};
