let ArticleController = require('../controllers/ArticleController');
let HomeController = require("../controllers/HomeController");
let VipController = require("../controllers/VipController");
let PhotoController = require("../controllers/PhotoController")

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);
    app.post('/', HomeController.Index);
    app.post('/connexion', HomeController.Connexion)
    app.get('/deconnexion', HomeController.Deconnexion)
    app.get('/accueil', HomeController.Index);

    app.get('/vip', VipController.Index)

    app.get('/vip/add', VipController.AddVIP);
    app.post('/vip/add', VipController.AddVIP);

    app.get('/vip/edit/:id', VipController.EditVIP);
    app.post('/vip/edit/:id', VipController.EditVIP);

    app.get('/vip/delete/:id', VipController.DeleteVIPId);
    app.post('/vip/delete/:id', VipController.DeleteVIPId);

    app.get('/photo', PhotoController.Index)

    app.get('/photo/add', PhotoController.AddPhoto)
    app.post('/photo/add', PhotoController.AddPhoto)

    app.get('/photo/:id', PhotoController.DeletePhoto)
    app.post('/photo/:id', PhotoController.DeletePhoto)

    app.get('/article', ArticleController.Index)

    app.get('/article/add', ArticleController.AddArticle)
    app.post('/article/add', ArticleController.AddArticle)

    app.get('/article/delete/:id', ArticleController.DeleteArticle)
    app.post('/article/delete/:id', ArticleController.DeleteArticle)

    app.get('/article/edit/:id', ArticleController.EditArticle)
    app.post('/article/edit/:id', ArticleController.EditArticle)

// tout le reste

    app.get('/error/404', HomeController.Error404)
    app.post('/error/404', HomeController.Error404)

    app.get('*', HomeController.NotFound)
    app.post('*', HomeController.NotFound)


};
