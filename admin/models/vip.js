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
                            VIP_DATE_INSERTION=FROM_UNIXTIME(${Date.now()} / 1000)`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id de l'acteur
 * @param {Date} debut  - Date de début de carrière
 * @param callback
 */
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

/**
 * @param {number} id       - Id de l'acteur
 * @param {string} role     - Role de l'acteur
 * @param {number} filmId   - Id du film
 * @param callback
 */
module.exports.addVipRole = function (id, role, filmId, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO joue SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            FILM_NUMERO=${connexion.escape(Number(filmId))}, 
                            ROLE_NOM=${connexion.escape(role)}`

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du réalisateur
 * @param callback
 */
module.exports.addRealisateur = function (id, callback) {
    db.getConnection(function (err, connexion) {
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
 * @param {Date} date   - Date de sortie du film
 * @param {string} film - Titre du film
 * @param callback
 */
module.exports.addVipFilm = function (id, date, film, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO film SET
                            VIP_NUMERO=${connexion.escape(id)}
                            FILM_TITRE=${connexion.escape(film)}
                            FILM_DATEREALISATION=${connexion.escape(date)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id           - Id du chanteur
 * @param {string} specialite   - Spécialité du chanteur
 * @param callback
 */
module.exports.addChanteur = function (id, specialite, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO chanteur SET 
                            VIP_NUMERO=${connexion.escape(id)},
                            CHANTEUR_SPECIALITE=${connexion.escape(specialite)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {Date} date           - Date de sortie de l'album
 * @param {string} titre        - Titre de l'album
 * @param {number} producteur   - Id de la maison de disque
 * @param callback
 */
module.exports.addAlbum = function (date, titre, producteur, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO album SET 
                            ALBUM_DATE="${connexion.escape(date)}", 
                            ALBUM_TITRE="${connexion.escape(titre)}", 
                            MAISONDISQUE_NUMERO=${connexion.escape(producteur)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du chanteur
 * @param {number} album    - Id de l'album
 * @param callback
 */
module.exports.addAlbumToVip = function (id, album, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO composer SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            ALBUM_NUMERO=${connexion.escape(album)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du mannequin
 * @param {string} taille   - Taille du mannequin
 * @param {number} agence   - Id de l'agence du mannequin
 * @param callback
 */
module.exports.addMannequin = function (id, taille, agence, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO mannequin SET 
                            VIP_NUMERO=${connexion.escape(id)},
                            MANNEQUIN_TAILLE='${connexion.escape(taille)}';
                       INSERT INTO apouragence SET
                            VIP_NUMERO=${connexion.escape(id)},
                            AGENCE_NUMERO=${connexion.escape(agence)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du mannequin
 * @param {number} defile   - Id du défilé
 * @param callback
 */
module.exports.addVipDefile = function (id, defile, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO defiledans SET 
                            DEFILE_NUMERO=${connexion.escape(defile)}, 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du couturier
 * @param callback
 */
module.exports.addCouturier = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO couturier SET 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du couturier
 * @param {Date} date   - Date du défilé
 * @param {string} lieu - Lieu du défilé
 * @param callback
 */
module.exports.addVipDefileOrga = function (id, date, lieu, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `INSERT INTO defile SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            DEFILE_DATE=${connexion.escape(date)}, 
                            DEFILE_LIEU=${connexion.escape(lieu)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}
