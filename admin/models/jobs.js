let db = require('../configDb');

/**
 * @param callback
 */
module.exports.getAgences = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT AGENCE_NUMERO AS id, AGENCE_NOM AS agence FROM agence`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getFilms = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT film_NUMERO AS id, FILM_TITRE AS titre FROM film`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getDefiles = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT DEFILE_NUMERO AS id, DEFILE_LIEU AS lieu, DEFILE_DATE AS date FROM defile`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getMaisonsDisque = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT MAISONDISQUE_NUMERO AS id, MAISONDISQUE_NOM AS nom FROM maisondisque`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getVipNames = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT VIP_NUMERO AS id, VIP_PRENOM AS prenom, VIP_NOM AS nom FROM vip.vip ORDER BY 3`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param callback
 */
module.exports.getExemplaires = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT EXEMPLAIRE_NUMERO AS numero, EXEMPLAIRE_DATEPUBLICATION AS date FROM exemplaire ORDER BY 2`;

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
            let sql = `SELECT 
                            DATE_EVENEMENT AS date, 
                            MARIAGE_LIEU AS lieu, 
                            MARIAGE_FIN AS fin, 
                            MARIAGE_MOTIFFIN AS motif, 
                            VIP_VIP_NUMERO AS conjoint_id
                        FROM mariage
                        WHERE VIP_NUMERO=${connexion.escape(id)} 
                        UNION ( 
                            SELECT 
                                DATE_EVENEMENT AS date, 
                                MARIAGE_LIEU AS lieu, 
                                MARIAGE_FIN AS fin, 
                                MARIAGE_MOTIFFIN AS motif, 
                                VIP_NUMERO AS conjoint_id
                            FROM mariage 
                            WHERE VIP_VIP_NUMERO=${connexion.escape(id)}
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
            let sql = `SELECT DATE_EVENEMENT AS date, 
                            LIAISON_MOTIFFIN AS motif,
                            VIP_VIP_NUMERO AS amant_id
                        FROM liaison
                        WHERE VIP_NUMERO=${connexion.escape(id)} 
                        UNION (
                            SELECT DATE_EVENEMENT AS date, 
                                LIAISON_MOTIFFIN AS motif,
                                VIP_NUMERO AS amant_id
                            FROM liaison
                            WHERE VIP_VIP_NUMERO=${connexion.escape(id)} 
                        ) ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

