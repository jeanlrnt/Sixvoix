let db = require('../configDb');

module.exports.getVipAlbums = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT CHANTEUR_SPECIALITE AS specialite, 
                            MAISONDISQUE_NOM AS maison_disque, 
                            ALBUM_TITRE AS titre, 
                            ALBUM_DATE AS date_sortie 
                        FROM chanteur 
                            JOIN composer c on chanteur.VIP_NUMERO = c.VIP_NUMERO 
                            JOIN album a on a.ALBUM_NUMERO = c.ALBUM_NUMERO 
                            JOIN maisondisque m on m.MAISONDISQUE_NUMERO = a.MAISONDISQUE_NUMERO 
                            JOIN vip v ON c.VIP_NUMERO = v.VIP_NUMERO 
                        WHERE c.VIP_NUMERO=${connexion.escape(id)} ORDER BY 4`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getVipPhotos = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT PHOTO_NUMERO AS photo_id, 
                            VIP_NUMERO AS vip_id, 
                            PHOTO_SUJET AS subject, 
                            PHOTO_COMMENTAIRE AS comment, 
                            PHOTO_ADRESSE AS path 
                        FROM photo 
                        WHERE PHOTO_NUMERO!=1 AND VIP_NUMERO=${connexion.escape(id)}`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getVipDefiles = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT DEFILE_DATE AS date_defile, 
                            DEFILE_LIEU AS lieu, 
                            MANNEQUIN_TAILLE AS taille, 
                            AGENCE_NOM AS agence, 
                            CONCAT(v.VIP_PRENOM, ' ', v.VIP_NOM) AS couturier, 
                            v.VIP_NUMERO AS couturier_id, 
                            CONCAT(SUBSTRING(v.VIP_TEXTE,1,200),'...') AS texte, 
                            PHOTO_ADRESSE AS path 
                        FROM defile d 
                            JOIN defiledans d2 on d.DEFILE_NUMERO = d2.DEFILE_NUMERO 
                            JOIN mannequin m on m.VIP_NUMERO = d2.VIP_NUMERO 
                            JOIN apouragence a on m.VIP_NUMERO = a.VIP_NUMERO 
                            JOIN agence a2 on a2.AGENCE_NUMERO = a.AGENCE_NUMERO 
                            JOIN vip v on d.VIP_NUMERO = v.VIP_NUMERO 
                            JOIN photo ON v.VIP_NUMERO = photo.VIP_NUMERO 
                        WHERE PHOTO_NUMERO=1 AND d2.VIP_NUMERO=${connexion.escape(id)} ORDER BY 1`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getDefilesOrganises = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT DEFILE_LIEU AS lieu, 
                            DEFILE_DATE AS date_defile 
                        FROM defile d 
                        WHERE VIP_NUMERO=${connexion.escape(id)} ORDER BY 2`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getVipFilms = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT a.VIP_NUMERO as acteur_id, 
                            ROLE_NOM AS role, 
                            FILM_DATEREALISATION AS date_realisation, 
                            FILM_TITRE AS titre, 
                            CONCAT(rea.VIP_PRENOM, ' ', rea.VIP_NOM) AS realisateur, 
                            ACTEUR_DATEDEBUT AS debut, 
                            rea.VIP_NUMERO AS realisateur_id, 
                            CONCAT(SUBSTRING(rea.VIP_TEXTE,1,200),'...') AS texte, 
                            PHOTO_ADRESSE AS path 
                        FROM acteur a 
                            LEFT JOIN joue j on a.VIP_NUMERO = j.VIP_NUMERO 
                            LEFT JOIN film f on f.film_NUMERO = j.FILM_NUMERO 
                            LEFT JOIN vip rea on rea.VIP_NUMERO = f.VIP_NUMERO 
                            LEFT JOIN photo p on rea.VIP_NUMERO = p.VIP_NUMERO 
                        WHERE a.VIP_NUMERO=${connexion.escape(id)} AND (ISNULL(PHOTO_NUMERO) OR PHOTO_NUMERO=1)`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getFilmsRealises = function(id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT FILM_TITRE AS titre, 
                            FILM_DATEREALISATION AS date_realisation 
                        FROM film f 
                            RIGHT JOIN realisateur r on r.VIP_NUMERO = f.VIP_NUMERO 
                        WHERE r.VIP_NUMERO=${connexion.escape(id)} ORDER BY 2`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}
