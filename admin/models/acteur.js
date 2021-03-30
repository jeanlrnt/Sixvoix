let db = require('../configDb');

/**
 * @param {number} id   - Id de l'acteur
 * @param {Date} debut  - Date de début de carrière
 * @param callback
 */
module.exports.addActeur = (id, debut, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO acteur SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            ACTEUR_DATEDEBUT='${connexion.escape(debut)}';`;

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
module.exports.updateActeur = (id, debut, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `UPDATE acteur 
                        SET ACTEUR_DATEDEBUT="${connexion.escape(debut)}"
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

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
module.exports.addVipRole = (id, role, filmId, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO joue SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            FILM_NUMERO=${connexion.escape(filmId)}, 
                            ROLE_NOM=${connexion.escape(role)}`

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id de l'acteur
 * @param callback
 */
module.exports.removeRolesActeur = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM joue WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id de l'acteur
 * @param callback
 */
module.exports.removeActeur = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `DELETE FROM acteur WHERE 
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
module.exports.getActeurFromId = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                           ACTEUR_DATEDEBUT AS debut
                       FROM acteur
                       WHERE VIP_NUMERO=${connexion.escape(id)}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipRoles = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT 
                            FILM_NUMERO AS film_id, 
                            ROLE_NOM AS role
                       FROM joue 
                       WHERE VIP_NUMERO=${connexion.escape(id)}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 */
module.exports.removeActeurFully = (id) => {
    this.removeRolesActeur(id, (err, _result) => {
        if (err) return console.error(err);
        this.removeActeur(id, (err1, _result1) => {
            if (err1) return console.error(err1);
        })
    })
}

/**
 * @param {number} id   - Id du vip
 * @param {Array} roles - Roles à ajouter sous la forme [role, filmId, ...]
 */
module.exports.addVipRoles = (id, roles) => {
    for (let i = 0; i < roles.length; i += 2) {
        if (roles[i] !== '' && roles[i + 1] !== '') {
            this.addVipRole(id, roles[i], roles[i + 1], (err, _result) => {
                if (err) return console.error(err);
            });
        }
    }
}

/**
 * @param {number} id   - Id du vip
 * @param {Array} roles - Roles à ajouter sous la forme [role, filmId, ...]
 * @param {Date} debut  - Date de début de la carrière de l'acteur
 */
module.exports.addActeurFully = (id, roles, debut) => {
    this.addActeur(id, debut, (err, _result) => {
        if (err) return console.error(err);
        this.addVipRoles(id, roles);
    })
}
