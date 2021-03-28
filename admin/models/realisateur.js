let db = require('../configDb');

/**
 * @param {number} id   - Id du réalisateur
 * @param callback
 */
module.exports.addRealisateur = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO realisateur SET 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du réalisateur
 * @param callback
 */
module.exports.getRealisateurFromId = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT VIP_NUMERO as id
                        FROM realisateur
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du réalisateur
 * @param {Date} date   - Date de sortie du film
 * @param {string} film - Titre du film
 * @param callback
 */
module.exports.addVipFilm = (id, date, film, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO film SET
                            VIP_NUMERO=${connexion.escape(id)},
                            FILM_TITRE=${connexion.escape(film)},
                            FILM_DATEREALISATION=${connexion.escape(date)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du réalisateur
 * @param callback
 */
module.exports.getFilmsRealisateur = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT FILM_NUMERO
                        FROM film
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du réalisateur
 * @param callback
 */
module.exports.removeRealisateur = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `DELETE FROM realisateur WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipFilms = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT 
                            FILM_NUMERO AS film,
                            FILM_TITRE AS titre,
                            FILM_DATEREALISATION AS date
                       FROM film
                       WHERE VIP_NUMERO=${connexion.escape(id)}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du film
 * @param callback
 */
module.exports.removeFilm = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `DELETE FROM film WHERE 
                            FILM_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du film
 * @param callback
 */
module.exports.getFilmActeurs = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT VIP_NUMERO
                        FROM joue
                        WHERE FILM_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du film
 * @param callback
 */
module.exports.removeFilmRoles = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM joue WHERE 
                            FILM_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du film
 * @param {string} titre    - Titre du film
 * @param {Date} date       - Date de réalisation du film
 * @param callback
 */
module.exports.updateFilm = (id,date ,titre, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `UPDATE film 
                       SET 
                        FILM_TITRE=${connexion.escape(titre)}, 
                        FILM_DATEREALISATION=${connexion.escape(date)}
                       WHERE film_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 */
module.exports.removeRealisateurFully = (id) => {
    this.getFilmsRealisateur(id, (err, result) => {
        if (err) return console.log(err);
        if (result[0] !== undefined) {
            for (const [i, film_num] of result.entries()) {
                this.removeFilmRoles(film_num.FILM_NUMERO, (err1, _result1) => {
                    if (err1) return console.log(err1);
                    this.removeFilm(film_num.FILM_NUMERO, (err2, _result2) => {
                        if (err2) return console.log(err2);
                        if (i === result.length - 1) {
                            this.removeRealisateur(id, (err3, _result3) => {
                                if (err3) return console.log(err3);
                            })
                        }
                    })
                })
            }
        } else {
            this.removeRealisateur(id, (err1, _result1) => {
                if (err1) return console.log(err1);
            })
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param {Array} films - Tableau de films sous la forme [filmId, date, titre, ...]
 */
module.exports.addFilms = (id, films) => {
    for (let i = 0; i < films.length; i += 3) {
        if (films[i + 1] !== '' && films[i + 2] !== '') {
            if (films[i] !== '') {
                this.updateFilm(films[i], films[i + 1], films[i + 2], (err1, _result1) => {
                    if (err1) return console.log(err1);
                });
            } else {
                this.addVipFilm(id, films[i + 1], films[i + 2], (err1, _result1) => {
                    if (err1) return console.log(err1);
                });
            }
        }
    }
}

/**
 * @param {number} id   - Id du vip
 * @param {Array} films - Tableau de films sous la forme [filmId, date, titre, ...]
 */
module.exports.addRealisateurFully = (id, films) => {
    this.addRealisateur(id, (err, _result) => {
        if (err) return console.log(err);
        this.addFilms(id, films)
    })
}