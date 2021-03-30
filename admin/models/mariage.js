let db = require('../configDb');


/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.removeMariagesVip = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM mariage WHERE 
                            VIP_NUMERO=${connexion.escape(id)} OR 
                            VIP_VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id           - Id du vip
 * @param {number} conjoint     - Id du Conjoint
 * @param {Date} date           - Date du mariage
 * @param {string} lieu         - Lieu du mariage
 * @param {Date} fin            - Date du divorce
 * @param {string} motif_fin    - Motif du divorce
 * @param callback
 */
module.exports.addMariage = (id, conjoint, date, lieu, fin, motif_fin, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO mariage SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            VIP_VIP_NUMERO=${connexion.escape(conjoint)}, 
                            DATE_EVENEMENT=${connexion.escape(date)}, 
                            MARIAGE_LIEU=${connexion.escape(lieu)}`;
            if (fin !== '') {
                sql += `,
                        MARIAGE_FIN=${connexion.escape(fin)}, 
                        MARIAGE_MOTIFFIN=${connexion.escape(motif_fin)}`
            }

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du vip
 * @param {Array} mariages  - Liaisons à ajouter sous la forme [date, lieu, amant, date_fin, motif_fin, ...]
 */
module.exports.addMariages = (id, mariages) => {
    for (let i = 0; i < mariages.length; i += 5) {
        if (mariages[i] !== '' && mariages[i + 1] !== '' && mariages[i + 2] !== '') {
            this.addMariage(id, mariages[i + 2], mariages[i], mariages[i + 1], mariages[i + 3], mariages[i + 4], (err) => {
                if (err) return console.error(err);
            })
        }
    }
}