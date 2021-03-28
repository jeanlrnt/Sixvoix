let HomeController = require('./../controllers/HomeController');
let VipController = require('./../controllers/VipController');
let AlbumController = require('./../controllers/AlbumController');
let ArticleController = require("../controllers/ArticleController");


// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);
    app.get('/accueil', HomeController.Index);

// VIP
    app.get('/repertoire', VipController.Repertoire);
    app.get('/repertoire/:lettre', VipController.Card);
    app.get('/vip/:id', VipController.Personne);


    app.get('/articles', ArticleController.Articles);
    app.get('/article/:id', ArticleController.Article);

 // albums
   app.get('/album', AlbumController.ListerAlbum);
    app.get('/album/:id', AlbumController.AlbumVip);

// tout le reste

    app.get('/error/404', HomeController.Error404)
    app.post('/error/404', HomeController.Error404)

    app.get('*', HomeController.NotFound)
    app.post('*', HomeController.NotFound)

};
