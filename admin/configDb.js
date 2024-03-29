/*
* config.Db contient les parametres de connection à la base de données
* Il utilise le module mysql
* il va créer aussi un pool de connexions utilisables
* la méthode getConnection permet de se connecter à MySQL
*
*/

let mysql = require('mysql'); // voir https://github.com/felixge/node-mysql/

let pool  = mysql.createPool({
    host      : 'localhost', //ip, nom de domaine de la base de donnée ex : 'localhost'
    user      : 'root', //identifiant de l'utilisateur de la base ex : 'bd'
    password  : 'root', //mot de passe associé à l'identifiant ex : 'bede'
    database  : 'vip', //nom de la base de donnée ex : 'vip'
    port      : '3306' //port d'écoute de MariaDB ex : '3306'
});

module.exports.getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
        if (err) return console.error(err);
    });
};
