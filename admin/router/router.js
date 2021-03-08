let HomeController = require("../controllers/HomeController");
let VipController = require("../controllers/VipController")

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);
    app.get('/accueil', HomeController.Index);

    app.get('/vip/add', VipController.AddVIP);
    app.post('/request/add', VipController.RqAdd)

// tout le reste
    app.get('*', HomeController.NotFound);
    app.post('*', HomeController.NotFound);

};
