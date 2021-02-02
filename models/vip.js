let db = require('../configDb');

module.exports.test = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT COUNT(*) AS NB FROM vip ;";
              // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.repertoire = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT DISTINCT SUBSTRING(VIP_NOM,1,1) AS letter FROM vip ORDER BY VIP_NOM; ";
            // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.personne = function(lettre, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_NOM AS nom, VIP_PRENOM AS prenom, PHOTO_ADRESSE AS path FROM vip JOIN photo ON vip.VIP_NUMERO=photo.VIP_NUMERO WHERE SUBSTRING(VIP_NOM,1,1)=" + connexion.escape(lettre) + " AND PHOTO_NUMERO=1 ORDER BY 1";
            // console.log(sql);
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};
