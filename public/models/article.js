let db = require('../configDb');

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipArticles = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT ARTICLE_TITRE AS titre, 
                            ARTICLE_RESUME AS resume, 
                            ARTICLE_DATE_INSERT AS date, 
                            CONCAT(VIP_PRENOM, ' ', VIP_NOM) AS auteur, 
                            v.VIP_NUMERO AS auteur_id 
                        FROM article 
                            JOIN apoursujet a ON article.ARTICLE_NUMERO = a.ARTICLE_NUMERO 
                            JOIN vip v ON v.VIP_NUMERO = a.VIP_NUMERO 
                        WHERE v.VIP_NUMERO=${connexion.escape(id)}
                        ORDER BY 3 DESC`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} number   - Nombre d'articles
 * @param callback
 */
module.exports.getAllArticles = (number, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT ARTICLE_TITRE AS titre, 
                            ARTICLE_RESUME AS resume, 
                            ARTICLE_DATE_INSERT AS date, 
                            CONCAT(VIP_PRENOM, ' ', VIP_NOM) AS auteur, 
                            v.VIP_NUMERO AS auteur_id 
                        FROM article 
                            JOIN apoursujet a ON article.ARTICLE_NUMERO = a.ARTICLE_NUMERO 
                            JOIN vip v ON v.VIP_NUMERO = a.VIP_NUMERO
                        ORDER BY 3 DESC LIMIT ${connexion.escape(number)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param callback
 */
module.exports.getAllVipAuteur = (callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT distinct v.VIP_NUMERO AS id, 
                            VIP_NOM AS nom, 
                            VIP_PRENOM AS prenom 
                        FROM vip v 
                            JOIN apoursujet a on v.VIP_NUMERO = a.VIP_NUMERO
                        ORDER BY 2`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}