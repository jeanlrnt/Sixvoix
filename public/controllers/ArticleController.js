let articleModel = require("../models/article.js");
let vipModel = require("../models/vip.js");
const async = require("async");

// ///////////////////////// A R T I C L E S    D E S     S T A R S

module.exports.Articles = function(request, response){
    response.title = 'Articles des stars';
    async.parallel([
            function (callback){
                articleModel.getAllVipAuteur(function (err, result){callback(null, result)});
            },
            function (callback){
                articleModel.getAllArticles(5, function (err, result){callback(null, result)});
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.vips = result[0];
            response.articles = result[1];

            response.render('articlesVip', response);
        }
    );
};

module.exports.Article = function(request, response){
    let id =  request.params.id;
    response.title = 'Articles de ' + id;
    async.parallel([
            function (callback){
                articleModel.getAllVipAuteur(function (err, result){callback(null, result)});
            },
            function (callback){
                articleModel.getVipArticles(id,(function (err, result){callback(null, result)}));
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.vips = result[0];
            response.articles = result[1];

            response.render('articlesVip', response);
        }
    );
};