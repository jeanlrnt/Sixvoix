let db = require('../configDb');


/**
 * @param {number} id           - Id du vip
 * @param {number} amant        - Id de l'amant
 * @param {Date} date           - Date de la liaison
 * @param {string} motif_fin    - Motif de fin de la liaison
 * @param callback
 */
module.exports.addLiaison = (id, amant, date, motif_fin, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO liaison SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            VIP_VIP_NUMERO=${connexion.escape(amant)}, 
                            DATE_EVENEMENT=${connexion.escape(date)},
                            LIAISON_MOTIFFIN=${connexion.escape(motif_fin)}`

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.removeLiaisonsVip = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM liaison WHERE 
                            VIP_NUMERO=${connexion.escape(id)} OR 
                            VIP_VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du vip
 * @param {Array} liaisons  - Liaisons à ajouter sous la forme [date, amant, motif_fin, ...]
 */
module.exports.addLiaisons = (id, liaisons) => {
    for (let i = 0; i < liaisons.length; i += 3) {
        if (liaisons[i] !== '' && liaisons[i + 1] !== '') {
            this.addLiaison(id, liaisons[i + 1], liaisons[i], liaisons[i + 2], (err, _result) => {
                if (err) return console.error(err);
            })
        }
    }
}