let db = require('../configDb');

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getCouturierById = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT VIP_NUMERO as id 
                        FROM couturier
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getCouturierDefiles = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT 
                            DEFILE_NUMERO AS defile_id,
                            DEFILE_LIEU AS lieu, 
                            DEFILE_DATE AS date
                        FROM defile
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback)
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du défilé
 * @param callback
 */
module.exports.removeDefile = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM defile WHERE 
                            DEFILE_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du couturier
 * @param callback
 */
module.exports.removeCouturier = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM couturier WHERE 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du défilé
 * @param callback
 */
module.exports.getDefileMannequins = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT VIP_NUMERO 
                        FROM defiledans
                        WHERE DEFILE_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du couturier
 * @param callback
 */
module.exports.getDefileCouturier = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT DEFILE_NUMERO
                        FROM defile
                        WHERE VIP_NUMERO=${connexion.escape(id)}`;

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
module.exports.addVipDefileOrga = (id, date, lieu, callback) => {
    db.getConnection((err, connexion) => {
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

/**
 * @param {number} id   - Id du defile
 * @param {Date} date   - Date du défilé
 * @param {string} lieu - Lieu du défilé
 * @param callback
 */
module.exports.updateDefile = (id, date, lieu, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `UPDATE defile SET 
                            DEFILE_DATE=${connexion.escape(date)}, 
                            DEFILE_LIEU=${connexion.escape(lieu)}
                       WHERE DEFILE_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du couturier
 * @param callback
 */
module.exports.addCouturier = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO couturier SET 
                            VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du defile
 * @param callback
 */
module.exports.removeDefileDansDefile = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `DELETE FROM defiledans WHERE DEFILE_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 */
module.exports.removeCouturierFully = (id) => {
    this.getDefileCouturier(id, (err, result) => {
        if (err) return console.error(err);
        if (result[0] !== undefined) {
            for (const [i, defile_num] of result.entries()) {
                this.removeDefileDansDefile(defile_num.DEFILE_NUMERO, (err1, _result1) => {
                    if (err1) return console.error(err1);
                    this.removeDefile(defile_num.DEFILE_NUMERO, (err2, _result2) => {
                        if (err2) return console.error(err2);
                        if (i === result.length - 1) {
                            this.removeCouturier(id, (err3, _result3) => {
                                if (err3) return console.error(err3);
                            })
                        }
                    })
                })
            }
        } else {
            this.removeCouturier(id, (err3, _result3) => {
                if (err3) return console.error(err3);
            })
        }
    })
}

/**
 * @param {number} id       - Id du vip
 * @param {Array} defiles   - Defiles à ajouter sous la forme [defileId, date, lieu, ...]
 */
module.exports.addDefiles = (id, defiles) => {
    for (let i = 0; i < defiles.length; i += 3) {
        if (defiles[i + 1] !== '' && defiles[i + 2] !== '') {
            if (defiles[i] !== '') {
                this.updateDefile(defiles[i], defiles[i + 1], defiles[i + 2], (err, _result) => {
                    if (err) return console.error(err);
                })
            } else {
                this.addVipDefileOrga(id, defiles[i + 1], defiles[i + 2], (err, _result3) => {
                    if (err) return console.error(err);
                });
            }
        }
    }
}

/**
 * @param {number} id       - Id du vip
 * @param {Array} defiles   - Defiles à ajouter sous la forme [defileId, date, lieu, ...]
 */
module.exports.addCouturierFully = (id, defiles) => {
    this.addCouturier(id, (err, _result) => {
        if (err) return console.error(err);
        this.addDefiles(id, defiles)
    })
}