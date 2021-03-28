let db = require('../configDb');

/**
 * @param {number} id   - Id de l'acteur
 * @param callback
 */
module.exports.getUser = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `SELECT 
                            LOGIN AS login, 
                            PASSWD AS password 
                        FROM parametres 
                        WHERE LOGIN=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}