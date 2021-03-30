let db = require('../configDb');
const fs = require("fs");
const path = require("path");


/**
 * @param {number} id           - Id de la photo
 * @param {number} photo_num    - Numéro de la photo
 * @param {string} adresse      - Adresse de la photo
 * @param {string} sujet        - Sujet de la photo
 * @param {string} commentaire  - Commentaire de la photo
 * @param callback
 */
module.exports.addPhoto = (id, photo_num, adresse, sujet, commentaire, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql = `INSERT INTO photo SET 
                            VIP_NUMERO=${connexion.escape(id)}, 
                            PHOTO_NUMERO=${connexion.escape(photo_num)}, 
                            PHOTO_ADRESSE=${connexion.escape(adresse)}, 
                            PHOTO_SUJET=${connexion.escape(sujet)}, 
                            PHOTO_COMMENTAIRE=${connexion.escape(commentaire)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipPhotos = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT PHOTO_NUMERO AS id, 
                            PHOTO_SUJET AS sujet, 
                            PHOTO_COMMENTAIRE AS commentaire, 
                            PHOTO_ADRESSE AS adresse 
                        FROM photo WHERE 
                            VIP_NUMERO=${connexion.escape(id)} 
                            AND PHOTO_NUMERO > 1
                        ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id           - Id du vip
 * @param {number} photo_name   - Id de la photo
 * @param callback
 */
module.exports.getVipPhotoFromName = (id, photo_name, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT PHOTO_NUMERO AS id, 
                            PHOTO_SUJET AS sujet, 
                            PHOTO_COMMENTAIRE AS commentaire, 
                            PHOTO_ADRESSE AS adresse 
                        FROM photo WHERE 
                            VIP_NUMERO=${connexion.escape(id)} 
                            AND PHOTO_ADRESSE=${connexion.escape(photo_name)}
                        ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipAllPhotos = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT PHOTO_NUMERO AS id, 
                            PHOTO_SUJET AS sujet, 
                            PHOTO_COMMENTAIRE AS commentaire, 
                            PHOTO_ADRESSE AS adresse 
                        FROM photo WHERE 
                            VIP_NUMERO=${connexion.escape(id)}
                        ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipPhotoProfil = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT PHOTO_NUMERO AS id, 
                            PHOTO_SUJET AS sujet, 
                            PHOTO_COMMENTAIRE AS commentaire, 
                            PHOTO_ADRESSE AS adresse 
                        FROM photo WHERE 
                            VIP_NUMERO=${connexion.escape(id)} 
                            AND PHOTO_NUMERO = 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param callback
 */
module.exports.getVipLastPhoto = (id, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `SELECT PHOTO_NUMERO AS id, 
                            PHOTO_SUJET AS sujet, 
                            PHOTO_COMMENTAIRE AS commentaire, 
                            PHOTO_ADRESSE AS adresse 
                        FROM photo WHERE 
                            VIP_NUMERO=${connexion.escape(id)}
                        ORDER BY 1 DESC
                        LIMIT 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id       - Id du vip
 * @param {number} photo    - Id de la photo
 * @param callback
 */
module.exports.removePhoto = (id, photo, callback) => {
    db.getConnection((err, connexion) => {
        if (!err) {
            let sql =  `DELETE FROM photo WHERE 
                            VIP_NUMERO=${connexion.escape(id)} 
                                AND PHOTO_NUMERO=${connexion.escape(photo)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

/**
 * @param {number} id   - Id du vip
 */
module.exports.removePhotosVip = (id) => {
    this.getVipAllPhotos(id, (err, result) => {
        if (err) return console.error(err);
        if (result[0] !== undefined) {
            for (const photo of result) {
                this.removePhotoVip(id, photo)
            }
        }
    })
}

/**
 * @param {number} id   - Id du vip
 * @param {photo} photo - Photo à supprimer sous la forme {id:number, adresse:string}
 */
module.exports.removePhotoVip = (id, photo) => {
    this.removePhoto(id, photo.id, (err, _result) => {
        if (err) return console.error(err)
        let address = __dirname + '../../../common/images/vip/' + photo.adresse;
        fs.stat(address, (err1, _result1) => {
            if (err1) return console.error(err1)
            fs.unlink(address, (err2, _result2) => {
                if (err2) return console.error(err2);
            });
        });
    })
}

/**
 * @param {photo} photo         - Fichier de la photo à ajouter
 * @param {number} photo_num    - Id de la photo
 * @param {string} photo_sujet  - Sujet de la photo
 * @param {string} photo_detail - Detail de la photo
 * @param {number} vip_num      - Id du vip
 * @param {string} vip_nom      - Nom du vip
 * @param {string} vip_prenom   - Prenom du vip
 */
module.exports.addPhotoVip = (photo, photo_num, photo_sujet, photo_detail, vip_num, vip_nom, vip_prenom) => {
    let sampleFile;
    let uploadPath;

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = photo;
    let name = vip_prenom + '_' + vip_nom + '_' + vip_num + '_' + photo_num + path.extname(sampleFile.name)
    uploadPath = __dirname + '../../../common/images/vip/' + name;
    this.addPhoto(vip_num, photo_num, name, photo_sujet, photo_detail, (err1, _result1) => {
        if (err1) return console.error(err1);
    })

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, (err1, _result1) => {
        if (err1) return console.error(err1);
    });
}