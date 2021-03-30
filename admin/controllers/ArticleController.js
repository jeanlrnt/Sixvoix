const vipModel = require("../models/vip");
const photoModel = require("../models/photo");
const async = require("async");
const path = require("path");
const fs = require("fs");
const jobsModel = require("../models/jobs");
const articleModel = require("../models/article");

module.exports.Index = function(request, response){
    if(!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'article'
    response.title = 'Admin Article';
    async.parallel([

            function (callback){
                vipModel.getAllVipsWithArticleNum(function(err, result) {callback(null, result)})
            }],
        function (err, result) {
            if (err) return console.error(err);

            let header = []
            for (const element in result[0][0]) {
                if (result[0][0].hasOwnProperty(element)) {
                    header.push(element)
                }
            }

            response.thead  = header;
            response.vip    = result[0];

            response.render('homeArticle', response);
        }
    );
};

module.exports.AddArticle = function(request, response){
    if(!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'article'
    response.title = 'Admin Article';
    let vip_num = request.body.vip_num;
    async.parallel([
            function (callback){
                vipModel.getAllVips(function (err, result){callback(null, result)});
            },
            function (callback){
                jobsModel.getExemplaires(function (err, result){callback(null, result)});
            },
            function (callback){
                if (vip_num !== undefined) {
                    articleModel.addArticle(request.body.article_titre, request.body.article_resume, request.body.article_exemplaire,function (err, result){
                        if (err) return console.error(err)
                        articleModel.addVipArticle(vip_num, result.insertId, function (err1, result1){
                            if (err1) return console.error(err1)
                        })
                    })
                }
                callback(null, null)
            }],
        function (err, result) {
            if (err) return console.error(err)

            response.vips = result[0];
            response.exemplaires = result[1];

            response.render('addArticle', response);
        }
    );
};

module.exports.DeleteArticle = function(request, response){
    if(!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'article'
    response.title = 'Admin Article';
    let vip_num = request.params.id;
    let article_num = request.body.article_to_delete;
    async.parallel([
            function (callback){
                setTimeout(function () {
                    articleModel.getVipArticles(vip_num, function (err, result){callback(null, result)});
                }, 10)
            },
            function (callback){
                if(article_num !== undefined){
                    articleModel.removeAPourSujetArticle(article_num, function (err, result){
                        if (err) return console.error(err)
                        articleModel.removeArticle(article_num, function (err1, result1){
                            if (err1) return console.error(err1)
                        })
                    })
                }callback(null, null)
            }
        ],
        function (err, result) {
            if (err) return console.error(err)

            response.article = result[0];

            response.render('deleteArticle', response);
        }
    );
};

module.exports.EditArticle = function(request, response){
    if(!request.session.username) {
        return response.redirect('/')
    }
    response.title = 'Admin Article';
    let vip_num = request.params.id;
    let article_num = request.body.article_to_edit;
    async.parallel([
            function (callback){
                setTimeout(function () {
                    articleModel.getVipArticles(vip_num, function (err, result){callback(null, result)});
                }, 10)
            },
            function (callback){
                if(article_num !== undefined){
                    articleModel.updateArticle(article_num, request.body.article_edited, function (err, result) {
                        if (err) return console.error(err)
                    })
                }
                callback(null, null)
            }
        ],
        function (err, result) {
            if (err) return console.error(err)

            response.article = result[0];

            response.render('editArticle', response);
        }
    );
};