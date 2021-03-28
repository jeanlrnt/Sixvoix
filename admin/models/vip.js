let db = require('../configDb');

/**
 * @param {number} nationalite  - Id de la nationnalité
 * @param {string} nom          - Nom du vip
 * @param {string} prenom       - Prénom du vip
 * @param {'H','F'} sexe        - Genre du vip
 * @param {Date} naissance      - Date de naissance du vip
 * @param {string} text         - Commentaire du vip
 * @param callback
 */
module.exports.addVip = (nationalite, nom, prenom, sexe, naissance, text, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql
            sql = `INSERT INTO vip SET 
                        NATIONALITE_NUMERO=${connexion.escape(nationalite)}, 
                        VIP_NOM=${connexion.escape(nom)}, 
                        VIP_PRENOM=${connexion.escape(prenom)}, 
                        VIP_SEXE=${connexion.escape(sexe)}, 
                        VIP_NAISSANCE=${connexion.escape(naissance)}, 
                        VIP_TEXTE=${connexion.escape(text)}, 
                        VIP_DATE_INSERTION=FROM_UNIXTIME(${Date.now()} / 1000)`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id           - Id du vip
 * @param {number} nationalite  - Id de la nationnalité
 * @param {string} nom          - Nom du vip
 * @param {string} prenom       - Prénom du vip
 * @param {'H','F'} sexe        - Genre du vip
 * @param {Date} naissance      - Date de naissance du vip
 * @param {string} text         - Commentaire du vip
 * @param callback
 */
module.exports.updateVip = (id, nationalite, nom, prenom, sexe, naissance, text, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql
            sql = `UPDATE vip 
                    SET NATIONALITE_NUMERO=${connexion.escape(nationalite)}, 
                        VIP_NOM=${connexion.escape(nom)}, 
                        VIP_PRENOM=${connexion.escape(prenom)}, 
                        VIP_SEXE=${connexion.escape(sexe)}, 
                        VIP_NAISSANCE=${connexion.escape(naissance)}, 
                        VIP_TEXTE=${connexion.escape(text)}
                    WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.removeVip = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM vip WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getVipFirstLetters = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT DISTINCT SUBSTRING(VIP_NOM,1,1) AS letter FROM vip ORDER BY VIP_NOM`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {char} lettre - Première lettre du nom des vips à séléctionner
 * @param callback
 */
module.exports.getVipsSelection = (lettre, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT vip.VIP_NUMERO AS id, 
                            VIP_NOM AS nom, 
                            VIP_PRENOM AS prenom, 
                            PHOTO_ADRESSE AS path 
                        FROM vip 
                            JOIN photo ON vip.VIP_NUMERO=photo.VIP_NUMERO 
                        WHERE SUBSTRING(VIP_NOM,1,1)=${connexion.escape(lettre)} AND PHOTO_NUMERO=1 ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipFromId = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                           NATIONALITE_NUMERO AS nationalite,
                           VIP_NOM AS nom,
                           VIP_PRENOM AS prenom,
                           VIP_SEXE AS sexe,
                           VIP_NAISSANCE AS naissance,
                           VIP_TEXTE AS description
                       FROM vip
                       WHERE VIP_NUMERO=${connexion.escape(id)}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getAllVips = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT 
                            VIP_NUMERO AS id, 
                            NATIONALITE_NOM AS nationalite, 
                            VIP_NOM AS nom, 
                            VIP_PRENOM AS prenom, 
                            VIP_SEXE AS sexe, 
                            VIP_NAISSANCE AS naissance
                       FROM vip.vip v 
                           JOIN nationalite n ON 
                               v.NATIONALITE_NUMERO = n.NATIONALITE_NUMERO
                               ORDER BY 1`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getAllVipsWithPhotoNum = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                           v.VIP_NUMERO AS id,
                           VIP_NOM AS nom,
                           VIP_PRENOM AS prenom,
                           COUNT(PHOTO_ADRESSE) AS photos
                       FROM vip.vip v
                                JOIN photo p ON
                           v.VIP_NUMERO = p.VIP_NUMERO
                       WHERE PHOTO_NUMERO > 1
                       GROUP BY p.VIP_NUMERO
                       ORDER BY 1`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getAllVipsWithArticleNum = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                           v.VIP_NUMERO AS id,
                           VIP_NOM AS nom,
                           VIP_PRENOM AS prenom,
                           COUNT(ARTICLE_NUMERO) AS articles
                       FROM vip.vip v
                            JOIN apoursujet a ON v.VIP_NUMERO = a.VIP_NUMERO 
                       GROUP BY a.VIP_NUMERO
                       ORDER BY 1`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}