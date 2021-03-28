let db = require('../configDb');


/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getArticlesVip = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT ARTICLE_NUMERO 
                        FROM apoursujet 
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipArticles = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT 
                            a.ARTICLE_NUMERO AS id, 
                            ARTICLE_TITRE AS titre, 
                            ARTICLE_DATE_INSERT AS date, 
                            ARTICLE_RESUME AS resume
                        FROM article a 
                            JOIN apoursujet a2 ON a.ARTICLE_NUMERO = a2.ARTICLE_NUMERO
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.removeAPourSujetVip = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `DELETE FROM apoursujet WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} id   - Id de l'article
 * @param callback
 */
module.exports.removeAPourSujetArticle = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `DELETE FROM apoursujet WHERE 
                            ARTICLE_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} id   - Id de l'article
 * @param callback
 */
module.exports.removeArticle = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `DELETE FROM article WHERE 
                            ARTICLE_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {string} titre        - Titre de l'article
 * @param {string} resume       - Résumé de l'article
 * @param {number} exemplaire   - Exemplaire de l'article
 * @param callback
 */
module.exports.addArticle = (titre, resume, exemplaire, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO article 
                        SET ARTICLE_TITRE=${connexion.escape(titre)}, 
                            ARTICLE_RESUME=${connexion.escape(resume)}, 
                            EXEMPLAIRE_NUMERO=${connexion.escape(exemplaire)}, 
                            ARTICLE_NUMEROPAGEDEBUT=1, 
                            ARTICLE_DATE_INSERT=FROM_UNIXTIME(${Date.now()} / 1000)`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} id   - Id du vip
 * @param article
 * @param callback
 */
module.exports.addVipArticle = (id, article, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO apoursujet 
                        SET ARTICLE_NUMERO=${connexion.escape(article)}, 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

/**
 * @param {number} id       - Id de l'article
 * @param {string} resume   - Résumé de l'article
 * @param callback
 */
module.exports.updateArticle = (id, resume, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `UPDATE article 
                        SET ARTICLE_RESUME=${connexion.escape(resume)} 
                        WHERE ARTICLE_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

/**
 * @param {number} id   - Id du vip
 */
module.exports.removeArticlesVip = (id) => {
    this.getArticlesVip(id, (err, result) => {
        if (err) return console.log(err);
        if (result[0] !== undefined) {
            for (const article_num of result) {
                this.removeAPourSujetArticle(article_num.ARTICLE_NUMERO, (err1, _result1) => {
                    if (err1) return console.log(err1);
                    this.removeArticle(article_num.ARTICLE_NUMERO, (err2, _result2) => {
                        if (err2) return console.log(err2);
                    })
                })
            }
        }
    })
}