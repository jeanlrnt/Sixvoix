let db = require('../configDb');


/**
 * @param {number} id   - Id du chanteur
 * @param callback
 */
module.exports.getAlbumsChanteur = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT ALBUM_NUMERO 
                        FROM composer 
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du chanteur
 * @param album         - Id de l'album
 * @param callback
 */
module.exports.removeComposer = (id, album, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM composer WHERE 
                            ALBUM_NUMERO=${connexion.escape(album)} AND 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id de l'album
 * @param callback
 */
module.exports.removeAlbum = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM album WHERE 
                            ALBUM_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du chanteur
 * @param callback
 */
module.exports.removeChanteur = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM chanteur WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

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
module.exports.addAlbumToVip = (id, album, callback) => {
    db.getConnection((err, connexion) => {
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
 * @param {Date} date           - Date de sortie de l'album
 * @param {string} titre        - Titre de l'album
 * @param {number} producteur   - Id de la maison de disque
 * @param callback
 */
module.exports.addAlbum = (date, titre, producteur, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO album SET 
                            ALBUM_DATE=${connexion.escape(date)}, 
                            ALBUM_TITRE=${connexion.escape(titre)}, 
                            MAISONDISQUE_NUMERO=${connexion.escape(producteur)}`;

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
module.exports.addChanteur = (id, specialite, callback) => {
    db.getConnection((err, connexion) => {
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
 * @param {number} id           - Id du chanteur
 * @param {string} specialite   - Spécialité du chanteur
 * @param callback
 */
module.exports.updateChanteur = (id, specialite, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `UPDATE chanteur SET 
                            CHANTEUR_SPECIALITE=${connexion.escape(specialite)}
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
module.exports.getChanteurFromId = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                           CHANTEUR_SPECIALITE AS specialite
                       FROM chanteur
                       WHERE VIP_NUMERO=${id}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getAlbumsVip = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                           MAISONDISQUE_NUMERO AS maison, 
                           ALBUM_TITRE AS titre, 
                           ALBUM_DATE AS date
                       FROM album a
                           JOIN composer c on a.ALBUM_NUMERO = c.ALBUM_NUMERO
                       WHERE
                           VIP_NUMERO=${connexion.escape(id)}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 */
module.exports.removeChanteurFully = (id) => {
    this.getAlbumsChanteur(id, (err, result) => {
        if (err) return console.log(err);
        if (result[0] !== undefined) {
            for (const [i, album_num] of result.entries()) {
                this.removeComposer(id, album_num.ALBUM_NUMERO, (err1, _result1) => {
                    if (err1) return console.log(err1);
                    this.removeAlbum(album_num.ALBUM_NUMERO, (err2, _result2) => {
                        if (err2) return console.log(err2);
                        if (i === result.length-1) {
                            this.removeChanteur(id, (err3, _result3) => {
                                if (err3) return console.log(err3);
                            })
                        }
                    })
                })
            }
        } else {
            this.removeChanteur(id, (err3, _result3) => {
                if (err3) return console.log(err3);
            })
        }
    })
}

/**
 * @param {number} id       - Id du vip
 * @param {Array} albums    - Albums à ajouter sous la forme [date, titre, maison de disque, ...]
 */
module.exports.addAlbums = (id, albums) => {
    for (let i = 0; i < albums.length; i += 3) {
        if (albums[i] !== '' && albums[i + 1] !== '' && albums[i + 2] !== '') {
            this.addAlbum(albums[i], albums[i + 1], albums[i + 2], (err, result) => {
                if (err) return console.log(err);
                this.addAlbumToVip(id, result.insertId, (err1, _result1) => {
                    if (err1) return console.log(err1);
                })
            })
        }
    }
}

/**
 * @param {number} id           - Id du vip
 * @param {Array} albums        - Albums à ajouter sous la forme [date, titre, maison de disque, ...]
 * @param {string} specialite   - Spécialité du chanteur
 */
module.exports.addChanteurFully = (id, albums, specialite) => {
    this.addChanteur(id, specialite, (err, _result) => {
        if (err) return console.log(err);
        this.addAlbums(id, albums)
    })
}
