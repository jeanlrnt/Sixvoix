let articleModel = require("../models/article.js");
const async = require("async");
const vipModel = require("../models/vip");

// ///////////////////////// A R T I C L E S    D E S     S T A R S

module.exports.Articles = function(request, response){
    request.session.menu = 'article';
    response.title = 'Articles des stars';
    async.parallel([
            function (callback){
                articleModel.getAllVipAuteur((err, result) => {callback(null, result)});
            }],
        (err, result) => {
            if (err) return console.error(err);

            response.vips = result[0];

            response.render('articlesVip', response);
        }
    );
};

module.exports.Article = function(request, response){
    request.session.menu = 'article';
    let id =  request.params.id;
    async.parallel([
            function (callback){
                articleModel.getAllVipAuteur((err, result) => {callback(null, result)});
            },
            function (callback){
                articleModel.getVipArticles(id,((err, result) => {callback(null, result)}));
            },
            function (callback){
                vipModel.getVipInfos(id,((err, result) => {callback(null, result)}));
            }],
        (err, result) => {
            if (err) return console.error(err);

            if (result[2][0] !== undefined) {
                response.title = 'Articles par ' + result[2][0].prenom + ' ' + result[2][0].nom.toUpperCase()
            } else {
                response.title = 'Articles des stars';
            }

            response.vips = result[0];
            response.articles = result[1];

            response.render('articlesVip', response);
        }
    );
};
