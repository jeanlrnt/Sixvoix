const nationaliteModel = require("../models/nationalite");
const jobsModel = require("../models/jobs");
const vipModel = require("../models/vip");
const async = require("async");

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

    let sampleFile;
    let uploadPath;

    if (!request.files || Object.keys(request.files).length === 0) {
        return request.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = request.files.image;
    uploadPath = __dirname + '../../../common/images/vip/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
        if (err)
            return response.status(500).send(err);

        response.imageOK = "image uploaded";
    });

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
                    vipModel.addActeur(result.insertId, tableauData['acteur_start'], function (erreur, retourne){callback(null, retourne)})

                    for (let i = 0; i < acteur.length; i+=2) {
                        if(acteur[i] !== '' && acteur[i+1] !== '') {
                            vipModel.addVipRole(result.insertId, acteur[i], acteur[i+1], function (erreur, retourne) {
                                if (erreur) {
                                    console.log(erreur);
                                    return false;
                                }
                            });
                            console.log(`Le role dans le film numéro ${Math.floor((i+3)/2)} à été ajouté au vip ${result.insertId}`)
                        } else {
                            console.log(`Le role dans le film numéro ${Math.floor((i+3)/2)} n'a pas pu être ajouté au vip ${result.insertId}`)
                        }
                    }
                }
                if (tableauData['real']){
                    vipModel.addRealisateur(result.insertId, function (erreur, retourne){callback(null, retourne)})

                    for (let i = 0; i < real.length; i+=2) {
                        if(real[i] !== '' && real[i+1] !== '') {
                            vipModel.addVipFilm(result.insertId, real[i], real[i+1], function (erreur, retourne) {
                                console.log("Films réalisés : { Date : " + real[i] + ', Film : ' + real[i+1] + ' }')
                                if (erreur) {
                                    console.log(erreur);
                                    return false;
                                }
                            });
                            console.log(`Le film numéro ${Math.floor((i+3)/2)} à été ajouté`)
                        } else {
                            console.log(`Le film numéro ${Math.floor((i+3)/2)} n'a pas pu être ajouté`)
                        }
                    }
                }
                if (tableauData['chanteur']) {
                    vipModel.addChanteur(result.insertId, tableauData["chanteur_specialite"], function (erreur, retourne){
                        if (erreur) {
                            console.log(erreur);
                            return false;
                        }
                    })

                    for (let i = 0; i < chant.length; i+=3) {
                        if(chant[i] !== '' && chant[i+1] !== '' && chant[i+2] !== '') {
                            vipModel.addAlbum(chant[i], chant[i+1], chant[i+2], function (erreur, retourne) {
                                if (erreur) {
                                    console.log(erreur);
                                    return false;
                                }
                                vipModel.addAlbumToVip(result.insertId, retourne.insertId, function (err2, return2){
                                    if (err2) {
                                        console.log(err2);
                                        return false;
                                    }
                                })
                            });
                            console.log(`L'album numéro ${Math.floor((i+3)/2)} à été ajouté au vip ${result.insertId}`)
                        } else {
                            console.log(`L'album numéro ${Math.floor((i+3)/2)} n'a pas pu être ajouté au vip ${result.insertId}`)
                        }
                    }
                }
                if (tableauData['mannequin']) {
                    vipModel.addMannequin(result.insertId, tableauData["mannequin_taille"], tableauData["mannequin_agence"], function (erreur, retourne){callback(null, result)})

                    for (let i = 0; i < model.length; i++) {
                        if(model[i] !== '') {
                            vipModel.addVipDefile(result.insertId, model[i], function (erreur, retourne) {
                                if (erreur) {
                                    console.log(erreur);
                                    return false;
                                }
                            });
                            console.log(`Le défilé numéro ${Math.floor((i+2)/2)} à été ajouté au vip ${result.insertId}`)
                        } else {
                            console.log(`Le défilé numéro ${Math.floor((i+2)/2)} n'a pas pu être ajouté au vip ${result.insertId}`)
                        }
                    }
                }
                if (tableauData['couturier']) {
                    vipModel.addCouturier(result.insertId, function (erreur, retourne) {callback(null, result)})
                    for (let i = 0; i < couturier.length; i+=2) {
                        if (couturier[i] !== '' && couturier[i+1] !== '') {
                            vipModel.addVipDefileOrga(result.insertId, couturier[i], couturier[i + 1], function (erreur, retourne) {
                                console.log("Défilés organisés : { Date : " + couturier[i] + ', Lieu : ' + couturier[i + 1] + ' }')
                                if (erreur) {
                                    console.log(erreur);
                                    return false;
                                }
                            });
                            console.log(`Le défilé numéro ${Math.floor((i+2)/2)} à été ajouté`)
                        } else {
                            console.log(`Le défilé numéro ${Math.floor((i+2)/2)} n'a pas pu être ajouté`)
                        }
                    }
                }
            });
        },]
    )

    response.array  = array;

    response.render('requestAdd', response);
};
