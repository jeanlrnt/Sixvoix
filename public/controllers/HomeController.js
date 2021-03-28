

  // ////////////////////////////////////////////// A C C U E I L
module.exports.Index = function(request, response){
    request.session.menu = 'home';
    response.title = "Bienvenue sur le site de SIXVOIX (IUT du Limousin).";
    response.render('home', response);
};

  module.exports.NotFound = function (request, response) {
      response.nextpage = "/error/404"
      response.render('notFound', response);
  };

  module.exports.Error404 = function (request, response) {
      request.session.menu = null;
      response.title = "Erreur 404";
      response.render('Error404', response);
  };
