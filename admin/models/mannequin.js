let db = require('../configDb');


/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getMannequinFromId = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                            MANNEQUIN_TAILLE AS taille
                       FROM mannequin m
                       WHERE m.VIP_NUMERO=${id}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getMannequinAgence = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                            AGENCE_NUMERO AS id
                       FROM apouragence
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
module.exports.getMannequinDefiles = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT
                            DEFILE_NUMERO AS defile_id
                       FROM defiledans
                       WHERE VIP_NUMERO=${id}`

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du mannequin
 * @param callback
 */
module.exports.removeMannequinAgence = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM apouragence WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du mannequin
 * @param callback
 */
module.exports.removeMannequin = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM mannequin WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du mannequin
 * @param callback
 */
module.exports.removeMannequinDefileDans = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM defiledans WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du mannequin
 * @param {number} agence   - Id de l'agence
 * @param callback
 */
module.exports.addVipAgence = (id, agence, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO apouragence SET 
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
module.exports.addVipDefile = (id, defile, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO defiledans SET 
                            DEFILE_NUMERO=${connexion.escape(Number(defile))}, 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du mannequin
 * @param {string} taille   - Taille du mannequin
 * @param callback
 */
module.exports.addMannequin = (id, taille, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO mannequin SET 
                            VIP_NUMERO=${connexion.escape(id)},
                            MANNEQUIN_TAILLE=${connexion.escape(taille)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du mannequin
 * @param {string} taille   - Taille du mannequin
 * @param callback
 */
module.exports.updateMannequin = (id, taille, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
        let sql = `UPDATE mannequin SET 
                        MANNEQUIN_TAILLE=${connexion.escape(taille)}
                    WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 */
module.exports.removeMannequinFully = (id) => {
    this.removeMannequinAgence(id, (err, _result) => {
        if (err) return console.error(err);
        this.removeMannequinDefileDans(id, (err1, _result1) => {
            if (err1) return console.error(err1);
            this.removeMannequin(id, (err2, _result2) => {
                if (err2) return console.error(err2);
            })
        })
    })
}

/**
 * @param {number} id       - Id du vip
 * @param {Array} defiles   - Défilés à ajouter au vip sous la forme [defile_num, ...]
 */
module.exports.addDefilesMannequin = (id, defiles) => {
    for (let i = 0; i < defiles.length; i++) {
        if (defiles[i] !== '') {
            this.addVipDefile(id, defiles[i], (err, _result) => {
                if (err) return console.error(err);
            });
        }
    }
}

/**
 * @param {number} id       - Id du vip
 * @param {Array} defiles   - Défilés à ajouter au vip sous la forme [defile_num, ...]
 * @param {string} taille   - Taille du vip
 * @param {number} agence   - Id de l'agence du mannequin
 */
module.exports.addMannequinFully = (id, defiles, taille, agence) => {
    this.addMannequin(id, taille, (err, _result) => {
        if (err) return console.error(err);
        this.addVipAgence(id, agence, (err1, _result1) => {
            if (err1) return console.error(err1);
            this.addDefilesMannequin(id, defiles)
        })
    })
}