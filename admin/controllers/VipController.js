const nationaliteModel = require("../models/nationalite");
const jobsModel = require("../models/jobs");
const vipModel = require("../models/vip");
const async = require("async");
const path = require("path");

module.exports.AddVIP = function(request, response){
    response.title = "Ajout d'un VIP";
    async.parallel([
            function (callback){
                nationaliteModel.getNationalites(function (err, result){callback(null, result)});
            },
            function (callback){
                jobsModel.getAgences(function (err, result){callback(null, result)});
            },
            function (callback){
                jobsModel.getFilms(function (err, result){callback(null, result)});
            },
            function (callback){
                jobsModel.getDefiles(function (err, result){callback(null, result)});
            },
            function (callback){
                jobsModel.getMaisonsDisque(function (err, result){callback(null, result)});
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.nationalite        = result[0]
            response.agence             = result[1]
            response.films              = result[2]
            response.defiles            = result[3]
            response.maisons_de_disque  = result[4]

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
            vipModel.addVip(tableauData['nationalite'], tableauData['nom'], tableauData['prenom'], tableauData['sexe'], tableauData['naissance'], tableauData['commentaire'], function (err0, result0) {
                if (err0) {
                    console.log(err0);
                    return;
                }

                if (tableauData['image_profil_sujet']) {
                    if (!request.files || Object.keys(request.files).length === 0) {
                        return request.status(400).send('No files were uploaded.');
                    }


                    let sampleFile;
                    let uploadPath;

                    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                    sampleFile = request.files.image_profil_file;
                    let name = request.body['prenom'] + '_' + request.body['nom'] + '_' + result0.insertId + '_0' + path.extname(sampleFile.name)
                    uploadPath = __dirname + '../../../common/images/vip/' + name;
                    vipModel.addPhoto(result0.insertId, 1, name, tableauData['image_profil_sujet'], tableauData['image_profil_detail'], function (erreur, retourne){})

                    // Use the mv() method to place the file somewhere on your server
                    sampleFile.mv(uploadPath, function(err) {
                        if (err)
                            return response.status(500).send(err);
                    });

                    let index = 1;

                    for (const file of request.files.image_file) {
                        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                        sampleFile = file;
                        name = request.body['prenom'] + '_' + request.body['nom'] + '_' + result0.insertId + '_' + index + path.extname(sampleFile.name)
                        uploadPath = __dirname + '../../../common/images/vip/' + name;
                        vipModel.addPhoto(result0.insertId, index + 1, name, tableauData['image_sujet'][index-1], tableauData['image_detail'][index-1], function (erreur, retourne){})

                        // Use the mv() method to place the file somewhere on your server
                        sampleFile.mv(uploadPath, function(err) {
                            if (err)
                                return response.status(500).send(err);
                        });
                        index++
                    }
                }

                if (tableauData['acteur']){
                    vipModel.addActeur(result0.insertId, tableauData['acteur_start'], function (err1, result1){
                        if (err1) {
                            console.log(err1);
                            return false;
                        }
                        for (let i = 0; i < acteur.length; i+=2) {
                            if(acteur[i] !== '' && acteur[i+1] !== '') {
                                vipModel.addVipRole(result0.insertId, acteur[i], acteur[i+1], function (err2, result2) {
                                    if (err2) {
                                        console.log(err2);
                                        return false;
                                    }
                                });
                            }
                        }
                    })
                }

                if (tableauData['realisateur']){
                    vipModel.addRealisateur(result0.insertId, function (err1, result1){
                        if (err1) {
                            console.log(err1);
                            return false;
                        }
                        for (let i = 0; i < real.length; i+=2) {
                            if(real[i] !== '' && real[i+1] !== '') {
                                vipModel.addVipFilm(result0.insertId, real[i], real[i+1], function (err2, result2) {
                                    if (err2) {
                                        console.log(err2);
                                        return false;
                                    }
                                });
                            }
                        }
                    })
                }

                if (tableauData['chanteur']) {
                    vipModel.addChanteur(result0.insertId, tableauData["chanteur_specialite"], function (err1, result1){
                        if (err1) {
                            console.log(err1);
                            return false;
                        }
                        for (let i = 0; i < chant.length; i+=3) {
                            if(chant[i] !== '' && chant[i+1] !== '' && chant[i+2] !== '') {
                                vipModel.addAlbum(chant[i], chant[i+1], chant[i+2], function (err2, result2) {
                                    if (err2) {
                                        console.log(err2);
                                        return false;
                                    }
                                    vipModel.addAlbumToVip(result0.insertId, result2.insertId, function (err3, result3){
                                        if (err3) {
                                            console.log(err3);
                                            return false;
                                        }
                                    })
                                });
                            }
                        }
                    })
                }

                if (tableauData['mannequin']) {
                    vipModel.addMannequin(result0.insertId, tableauData["mannequin_taille"], function (err1, result1){
                        if (err1) {
                            console.log(err1);
                            return false;
                        }
                        vipModel.addVipAgence(result0.insertId, tableauData["mannequin_agence"], function (err2, result2) {
                            if (err2) {
                                console.log(err2);
                                return false;
                            }
                        })
                        for (let i = 0; i < model.length; i++) {
                            if(model[i] !== '') {
                                vipModel.addVipDefile(result0.insertId, model[i], function (err2, result2) {
                                    if (err2) {
                                        console.log(err2);
                                        return false;
                                    }
                                });
                            }
                        }
                    })
                }

                if (tableauData['couturier']) {
                    vipModel.addCouturier(result0.insertId, function (err1, result1) {
                        if (err1) {
                            console.log(err1);
                            return false;
                        }
                        for (let i = 0; i < couturier.length; i+=2) {
                            if (couturier[i] !== '' && couturier[i+1] !== '') {
                                vipModel.addVipDefileOrga(result0.insertId, couturier[i], couturier[i + 1], function (err2, result2) {
                                    if (err2) {
                                        console.log(err2);
                                        return false;
                                    }
                                });
                            }
                        }
                    })
                }
            });
        },]
    )

    response.array  = array;

    response.render('requestAdd', response);
};
