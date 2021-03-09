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

module.exports.addVip = function (nationalite, nom, prenom, sexe, naissance, text, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO vip SET 
                            NATIONALITE_NUMERO=${connexion.escape(nationalite)}, 
                            VIP_NOM=${connexion.escape(nom)}, 
                            VIP_PRENOM=${connexion.escape(prenom)}, 
                            VIP_SEXE=${connexion.escape(sexe)}, 
                            VIP_NAISSANCE=${connexion.escape(naissance)}, 
                            VIP_TEXTE=${connexion.escape(text)}, 
                            VIP_DATE_INSERTION=FROM_UNIXTIME(${Date.now() + 30*1000} / 1000) AS mysql_date_time`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addActeur = function (id, debut, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO acteur SET 
                            VIP_NUMERO=${id}, 
                            ACTEUR_DATEDEBUT='${debut}';`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addVipRole = function (id, role, film, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT * FROM vip`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addRealisateur = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO realisateur SET 
                            VIP_NUMERO=${id}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addVipFilm = function (id, date, film, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT * FROM vip`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addChanteur = function (id, specialite, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO chanteur SET 
                            VIP_NUMERO=${id},
                            CHANTEUR_SPECIALITE='${connexion.escape(specialite)}'`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addVipAlbum = function (id, date, titre, producteur, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT * FROM vip`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addMannequin = function (id, taille, agence, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO chanteur SET 
                            VIP_NUMERO=${id},
                            MANNEQUIN_TAILLE='${connexion.escape(taille)}';
                       INSERT INTO apouragence SET
                            VIP_NUMERO=${id},
                            AGENCE_NUMERO=${agence}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addVipDefile = function (id, date, lieu, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT * FROM vip`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.addVipDefileOrga = function (id, date, lieu, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT * FROM vip`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}
