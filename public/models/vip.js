let db = require('../configDb');

/**
 * @param callback
 */
module.exports.getRepertoireLetters = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT DISTINCT SUBSTRING(VIP_NOM,1,1) AS letter FROM vip ORDER BY VIP_NOM`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {char} lettre  - Première lettre du nom des vips
 * @param callback
 */
module.exports.getRepertoireResult = (lettre, callback) => {
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
module.exports.getVipInfos = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT v.VIP_NUMERO AS id,
                            VIP_NOM AS nom,
                            VIP_PRENOM AS prenom,
                            VIP_SEXE AS sexe,
                            VIP_NAISSANCE AS naissance,
                            VIP_TEXTE AS about,
                            PHOTO_ADRESSE AS path,
                            NATIONALITE_NOM AS nationalite
                        FROM vip v
                            JOIN photo p ON v.VIP_NUMERO=p.VIP_NUMERO
                            JOIN nationalite n ON n.NATIONALITE_NUMERO=v.NATIONALITE_NUMERO
                        WHERE v.VIP_NUMERO=${connexion.escape(id)} AND PHOTO_NUMERO=1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipMariages = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT DATE_EVENEMENT AS start, 
                            MARIAGE_LIEU AS lieu, 
                            MARIAGE_FIN AS end, 
                            MARIAGE_MOTIFFIN AS motif, 
                            CONCAT(v.VIP_PRENOM, ' ', v.VIP_NOM) AS conjoint, 
                            v.VIP_NUMERO AS conjoint_id, 
                            CONCAT(SUBSTRING(v.VIP_TEXTE,1,200),'...') AS texte, 
                            PHOTO_ADRESSE AS path 
                        FROM mariage m 
                            JOIN vip v on v.VIP_NUMERO = m.VIP_VIP_NUMERO 
                            JOIN photo ON v.VIP_NUMERO = photo.VIP_NUMERO 
                        WHERE PHOTO_NUMERO=1 AND m.VIP_NUMERO=${connexion.escape(id)} 
                        UNION ( 
                            SELECT DATE_EVENEMENT AS start, 
                                MARIAGE_LIEU AS lieu, 
                                MARIAGE_FIN AS end, 
                                MARIAGE_MOTIFFIN AS motif, 
                                CONCAT(v.VIP_PRENOM, ' ', v.VIP_NOM) AS conjoint, 
                                v.VIP_NUMERO AS conjoint_id, 
                                CONCAT(SUBSTRING(v.VIP_TEXTE,1,200),'...') AS texte, 
                                PHOTO_ADRESSE AS path 
                            FROM mariage m 
                                JOIN vip v on v.VIP_NUMERO = m.VIP_NUMERO 
                                JOIN photo ON v.VIP_NUMERO = photo.VIP_NUMERO 
                            WHERE PHOTO_NUMERO=1 AND m.VIP_VIP_NUMERO=${connexion.escape(id)}
                        ) ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipLiaisons = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT DATE_EVENEMENT AS start, 
                            LIAISON_MOTIFFIN AS motif, 
                            CONCAT(v.VIP_PRENOM, ' ', v.VIP_NOM) AS amant, 
                            v.VIP_NUMERO AS amant_id, 
                            CONCAT(SUBSTRING(v.VIP_TEXTE,1,200),'...') AS texte, 
                            PHOTO_ADRESSE AS path 
                        FROM liaison l 
                            JOIN vip v on v.VIP_NUMERO = l.VIP_VIP_NUMERO 
                            JOIN photo ON l.VIP_VIP_NUMERO = photo.VIP_NUMERO 
                        WHERE PHOTO_NUMERO=1 AND l.VIP_NUMERO=${connexion.escape(id)} 
                        UNION (
                            SELECT DATE_EVENEMENT AS start, 
                                LIAISON_MOTIFFIN AS motif, 
                                CONCAT(v.VIP_PRENOM, ' ', v.VIP_NOM) AS amant, 
                                v.VIP_NUMERO AS amant_id, 
                                CONCAT(SUBSTRING(v.VIP_TEXTE,1,200),'...') AS texte, 
                                PHOTO_ADRESSE AS path 
                            FROM liaison l 
                                JOIN vip v on v.VIP_NUMERO = l.VIP_NUMERO 
                                JOIN photo ON l.VIP_NUMERO = photo.VIP_NUMERO 
                            WHERE PHOTO_NUMERO=1 AND l.VIP_VIP_NUMERO=${connexion.escape(id)}
                        ) ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipPhotos = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT PHOTO_NUMERO AS photo_id, 
                            VIP_NUMERO AS vip_id, 
                            PHOTO_SUJET AS subject, 
                            PHOTO_COMMENTAIRE AS comment, 
                            PHOTO_ADRESSE AS path 
                        FROM photo 
                        WHERE PHOTO_NUMERO!=1 AND VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}