let db = require('../configDb');

module.exports.getAgences = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT AGENCE_NUMERO AS id, AGENCE_NOM AS agence FROM agence`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getFilms = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT film_NUMERO AS id, FILM_TITRE AS titre FROM film`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getDefiles = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT DEFILE_NUMERO AS id, DEFILE_LIEU AS lieu, DEFILE_DATE AS date FROM defile`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}

module.exports.getMaisonsDisque = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = `SELECT MAISONDISQUE_NUMERO AS id, MAISONDISQUE_NOM AS nom FROM maisondisque`;

            connexion.query(sql, callback);
            connexion.release();
        }
    })
}