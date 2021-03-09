const nationaliteModel = require("../models/nationalite");
const agenceModel = require("../models/jobs");
const vipModel = require("../models/vip");
const async = require("async");

module.exports.AddVIP = function(request, response){
    response.title = "Ajout d'un VIP";
    async.parallel([
            function (callback){
                nationaliteModel.getNationalites(function (err, result){callback(null, result)});
            },
            function (callback){
                agenceModel.getAgences(function (err, result){callback(null, result)});
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.nationalite = result[0]
            response.agence = result[1]

            response.render('addVIP', response);
        }
    );
};

module.exports.RqAdd = function(request, response){
    response.title = "API add";


    let data = request.body;

    let acteur = [],
        real = [],
        chant = [],
        model = [],
        couturier = [],
        tableauData = []
    let array = '';
    for(let dataKey in data) {
        array = array.concat(`${dataKey} : "${data[dataKey]}" , `)
        tableauData[dataKey] = data[dataKey]
        if (dataKey.includes('acteur_film')) acteur.push(tableauData[dataKey])
        if (dataKey.includes('real_film')) real.push(tableauData[dataKey])
        if (dataKey.includes('chant_album')) chant.push(tableauData[dataKey])
        if (dataKey.includes('model_defile')) model.push(tableauData[dataKey])
        if (dataKey.includes('couturier_defile')) couturier.push(tableauData[dataKey])
    }

    async.parallel([
            function (callback) {
                vipModel.addVip(tableauData['nationalite'], tableauData['nom'], tableauData['prenom'], tableauData['sexe'], tableauData['naissance'], tableauData['commentaire'], function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (tableauData['acteur']){
                        vipModel.addActeur(result.insertId, tableauData['acteur_start'], function (err, result){callback(null, result)})

                        for (let i = 0; i < acteur.length; i+=2) {
                            vipModel.addVipRole(result.insertId, acteur[i], acteur[i+1], function (err, result) {
                                console.log("Films joués : { Role : " + acteur[i] + ', Film : ' + acteur[i+1] + ' }')
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                            });
                        }
                    }
                    if (tableauData['real']){
                        vipModel.addRealisateur(result.insertId, function (err, result){callback(null, result)})

                        for (let i = 0; i < real.length; i+=2) {
                            vipModel.addVipFilm(result.insertId, real[i], real[i+1], function (err, result) {
                                console.log("Films réalisés : { Date : " + real[i] + ', Film : ' + real[i+1] + ' }')
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                            });
                        }
                    }
                    if (tableauData['chanteur']) {
                        vipModel.addChanteur(result.insertId, tableauData["chanteur_specialite"], function (err, result){callback(null, result)})

                        for (let i = 0; i < chant.length; i+=3) {
                            vipModel.addVipAlbum(result.insertId, chant[i], chant[i+1], chant[i+2], function (err, result) {
                                console.log("Albums réalisés : { Date : " + chant[i] + ', Titre : ' + chant[i+1] + ', Maison de disque : ' + chant[i+2] + ' }')
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                            });
                        }
                    }
                    if (tableauData['mannequin']) {
                        vipModel.addMannequin(result.insertId, tableauData["mannequin_taille"], tableauData["mannequin_agence"], function (err, result){callback(null, result)})
                    }
                    for (let i = 0; i < model.length; i+=2) {
                        vipModel.addVipDefile(result.insertId, model[i], model[i+1], function (err, result) {
                            console.log("Defilés réalisés : { Date : " + model[i] + ', Lieu : ' + model[i+1] + ' }')
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    }
                    for (let i = 0; i < couturier.length; i+=2) {
                        vipModel.addVipDefileOrga(result.insertId, couturier[i], couturier[i+1], function (err, result) {
                            console.log("Défilés organisés : { Date : " + couturier[i] + ', Lieu : ' + couturier[i+1] + ' }')
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    }
                });
            },
        ]
    )


    console.log(tableauData)

    response.array  = array;

    response.render('requestAdd', response);
};
