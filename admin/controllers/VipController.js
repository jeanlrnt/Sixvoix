const nationaliteModel = require("../models/nationalite");
const jobsModel = require("../models/jobs");
const vipModel = require("../models/vip");
const mariageModel = require("../models/mariage");
const liaisonModel = require("../models/liaison");
const articleModel = require("../models/article");
const mannequinModel = require("../models/mannequin");
const chanteurModel = require("../models/chanteur");
const realisateurModel = require("../models/realisateur");
const couturierModel = require("../models/couturier");
const acteurModel = require("../models/acteur");
const photoModel = require("../models/photo");
const async = require("async");


module.exports.AddVIP = function (request, response) {
    if (!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'vip';
    response.title = 'Admin Vip';

    let data = request.body;

    let acteur = [],
        real = [],
        chant = [],
        model = [],
        couturier = [],
        mariage = [],
        liaison = [],
        tableauData = [];

    for (let dataKey in data) {
        if (data.hasOwnProperty(dataKey)) {
            tableauData[dataKey] = data[dataKey]
            if (dataKey.includes('mariage_vip')) mariage.push(tableauData[dataKey])
            if (dataKey.includes('liaison_vip')) liaison.push(tableauData[dataKey])
            if (dataKey.includes('acteur_film')) acteur.push(tableauData[dataKey])
            if (dataKey.includes('real_film')) real.push(tableauData[dataKey])
            if (dataKey.includes('chant_album')) chant.push(tableauData[dataKey])
            if (dataKey.includes('model_defile')) model.push(tableauData[dataKey])
            if (dataKey.includes('couturier_defile')) couturier.push(tableauData[dataKey])

        }
    }

    async.parallel([
            function (callback) {
                nationaliteModel.getNationalites((err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                jobsModel.getAgences((err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                jobsModel.getFilms((err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                jobsModel.getDefiles((err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                jobsModel.getMaisonsDisque((err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                jobsModel.getVipNames((err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                if (tableauData['nationalite'] !== undefined) {
                    vipModel.addVip(tableauData['nationalite'],
                        tableauData['nom'],
                        tableauData['prenom'],
                        tableauData['sexe'],
                        tableauData['naissance'],
                        tableauData['commentaire'],
                        (err, result) => {
                            if (err) return console.error(err);

                            if (tableauData['image_profil_sujet']) {
                                if (!request.files || Object.keys(request.files).length === 0) {
                                    return false;
                                }

                                photoModel.addPhotoVip(request.files.image_profil_file, 1, tableauData['image_profil_sujet'], tableauData['image_profil_detail'], result.insertId, request.body['nom'], request.body['prenom'])

                                let index = 1;

                                if (request.files.image_file !== undefined) {
                                    if (request.files.image_file.length !== undefined) {
                                        for (const file of request.files.image_file) {
                                            photoModel.addPhotoVip(file, index + 1, tableauData['image_sujet'][index - 1], tableauData['image_detail'][index - 1], result.insertId, request.body['nom'], request.body['prenom'])
                                            index++
                                        }
                                    } else {
                                        photoModel.addPhotoVip(request.files.image_file, index + 1, tableauData['image_sujet'][index - 1], tableauData['image_detail'][index - 1], result.insertId, request.body['nom'], request.body['prenom'])
                                    }
                                }
                            }

                            if (tableauData['mariage']) {
                                mariageModel.addMariages(result.insertId, mariage)
                            }

                            if (tableauData['liaison']) {
                                liaisonModel.addLiaisons(result.insertId, liaison)
                            }

                            if (tableauData['acteur']) {
                                acteurModel.addActeurFully(result.insertId, acteur, tableauData['acteur_start'])
                            }

                            if (tableauData['realisateur']) {
                                realisateurModel.addRealisateurFully(result.insertId, real)
                            }

                            if (tableauData['chanteur']) {
                                chanteurModel.addChanteurFully(result.insertId, chant, tableauData["chanteur_specialite"])
                            }

                            if (tableauData['mannequin']) {
                                mannequinModel.addMannequinFully(result.insertId, model, tableauData["mannequin_taille"], tableauData['mannequin_agence'])
                            }

                            if (tableauData['couturier']) {
                                couturierModel.addCouturierFully(result.insertId, couturier)
                            }
                        });

                    callback(null, 'Le vip a bien été ajouté')
                } else {
                    callback(null, null)
                }
            }],
        (err, result) => {
            if (err) return console.error(err);

            response.nationalite = result[0];
            response.agence = result[1];
            response.films = result[2];
            response.defiles = result[3];
            response.maisons_de_disque = result[4];
            response.conjoint = result[5];
            response.reponseRequette = result[6];

            response.render('addVIP', response);
        }
    );
};

module.exports.DeleteVIPId = function (request, response) {
    if (!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'vip';
    response.title = 'Admin Vip';
    let vip_num = request.params.id;
    setTimeout(function () {
        realisateurModel.removeRealisateurFully(vip_num)
        acteurModel.removeActeurFully(vip_num)
        chanteurModel.removeChanteurFully(vip_num)
        mannequinModel.removeMannequinFully(vip_num)
        couturierModel.removeCouturierFully(vip_num)
        articleModel.removeArticlesVip(vip_num, (err, _result) => {
            if (err) return console.error(err);
        })
        photoModel.removePhotosVip(vip_num)
        mariageModel.removeMariagesVip(vip_num, (err, _result) => {
            if (err) return console.error(err);
        })
        liaisonModel.removeLiaisonsVip(vip_num, (err, _result) => {
            if (err) return console.error(err);
        })
    }, 0)
    setTimeout(function () {
        vipModel.removeVip(vip_num, (err, _result) => {
            if (err) return console.error(err);
            response.redirect('/vip')
        })
    }, 50)
}

module.exports.EditVIP = function (request, response) {
    if (!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'vip';
    response.title = 'Admin Vip';
    let vip_num = request.params.id;

    let data = request.body;

    let acteur = [],
        real = [],
        chant = [],
        model = [],
        couturier = [],
        mariage = [],
        liaison = [],
        tableauData = [];

    for (let dataKey in data) {
        if (data.hasOwnProperty(dataKey)) {
            tableauData[dataKey] = data[dataKey]
            if (dataKey.includes('mariage_vip')) mariage.push(tableauData[dataKey])
            if (dataKey.includes('liaison_vip')) liaison.push(tableauData[dataKey])
            if (dataKey.includes('acteur_film')) acteur.push(tableauData[dataKey])
            if (dataKey.includes('real_film')) real.push(tableauData[dataKey])
            if (dataKey.includes('chant_album')) chant.push(tableauData[dataKey])
            if (dataKey.includes('model_defile')) model.push(tableauData[dataKey])
            if (dataKey.includes('couturier_defile')) couturier.push(tableauData[dataKey])
        }
    }

    async.series([
            function (callback) {
                if (tableauData['nationalite'] !== undefined) {
                    vipModel.updateVip(vip_num, tableauData['nationalite'], tableauData['nom'], tableauData['prenom'], tableauData['sexe'], tableauData['naissance'], tableauData['commentaire'], (err, _result) => {
                        if (err) return console.error(err);
                        if (tableauData['mariage']) {
                            mariageModel.removeMariagesVip(vip_num, (err1, _result1) => {
                                if (err1) return console.error(err1);
                                mariageModel.addMariages(vip_num, mariage)
                            })
                        }

                        if (tableauData['liaison']) {
                            liaisonModel.removeLiaisonsVip(vip_num, (err1, _result1) => {
                                if (err1) return console.error(err1);
                                liaisonModel.addLiaisons(vip_num, liaison)
                            })
                        }
                        acteurModel.getActeurFromId(vip_num, (err1, result1) => {
                            if (err1) return console.error(err1);
                            if (result1[0] !== undefined) {
                                if (tableauData['acteur']) {
                                    acteurModel.updateActeur(vip_num, tableauData['acteur_start'], (err2, _result2) => {
                                        if (err2) return console.error(err2);
                                        acteurModel.removeRolesActeur(vip_num, (err3, _result3) => {
                                            if (err3) return console.error(err3);
                                            acteurModel.addVipRoles(vip_num, acteur);
                                        })
                                    })
                                } else {
                                    acteurModel.removeActeurFully(vip_num)
                                }
                            } else {
                                if (tableauData['acteur']) {
                                    acteurModel.addActeurFully(vip_num, acteur, tableauData['acteur_start'])
                                }
                            }
                        })

                        realisateurModel.getRealisateurFromId(vip_num, (err1, result1) => {
                            if (err1) return console.error(err1);
                            if (result1[0] !== undefined) {
                                if (tableauData['realisateur']) {
                                    realisateurModel.addFilms(vip_num, real)
                                } else {
                                    realisateurModel.removeRealisateurFully(vip_num)
                                }
                            } else {
                                if (tableauData['realisateur']) {
                                    realisateurModel.addRealisateurFully(vip_num, real)
                                }
                            }
                        })

                        chanteurModel.getChanteurFromId(vip_num, (err1, result1) => {
                            if (err1) return console.error(err1);
                            if (result1[0] !== undefined) {
                                if (tableauData['chanteur']) {
                                    chanteurModel.updateChanteur(vip_num, tableauData["chanteur_specialite"], (err2, _result2) => {
                                        if (err2) return console.error(err2);
                                        chanteurModel.getAlbumsChanteur(vip_num, (err3, result3) => {
                                            if (err3) return console.error(err3);
                                            for (const album_num of result3) {
                                                chanteurModel.removeComposer(vip_num, album_num.ALBUM_NUMERO, (err4, _result4) => {
                                                    if (err4) return console.error(err4);
                                                    chanteurModel.removeAlbum(album_num.ALBUM_NUMERO, (err5, _result5) => {
                                                        if (err5) return console.error(err5);
                                                    })
                                                })
                                            }
                                            setTimeout(function () {
                                                chanteurModel.addAlbums(vip_num, chant)
                                            }, 20)
                                        })
                                    })
                                } else {
                                    chanteurModel.removeChanteurFully(vip_num)
                                }
                            } else {
                                if (tableauData['chanteur']) {
                                    chanteurModel.addChanteurFully(vip_num, chant, tableauData["chanteur_specialite"])
                                }
                            }
                        })

                        mannequinModel.getMannequinFromId(vip_num, (err1, result1) => {
                            if (err1) return console.error(err1);
                            if (result1[0] !== undefined) {
                                if (tableauData['mannequin']) {
                                    mannequinModel.updateMannequin(vip_num, tableauData["mannequin_taille"], (err2, _result2) => {
                                        if (err2) return console.error(err2);
                                        mannequinModel.removeMannequinAgence(vip_num, (err3, _result3) => {
                                            if (err3) return console.error(err3);
                                            mannequinModel.addVipAgence(vip_num, tableauData["mannequin_agence"], (err4, _result4) => {
                                                if (err4) return console.error(err4);
                                            })
                                        })
                                        mannequinModel.removeMannequinDefileDans(vip_num, (err3, _result3) => {
                                            if (err3) return console.error(err3);
                                            mannequinModel.addDefilesMannequin(vip_num, model)
                                        })
                                    })
                                } else {
                                    mannequinModel.removeMannequinFully(vip_num)
                                }
                            } else {
                                if (tableauData['mannequin']) {
                                    mannequinModel.addMannequinFully(vip_num, model, tableauData["mannequin_taille"], tableauData['mannequin_agence'])
                                }
                            }
                        })

                        couturierModel.getCouturierById(vip_num, (err1, result1) => {
                            if (err1) return console.error(err1);
                            if (result1[0] !== undefined) {
                                if (tableauData['couturier']) {
                                    couturierModel.addDefiles(vip_num, couturier)
                                } else {
                                    couturierModel.removeCouturierFully(vip_num)
                                }
                            } else {
                                if (tableauData['couturier']) {
                                    couturierModel.addCouturierFully(vip_num, couturier)
                                }
                            }
                        })
                    });
                    callback(null, 'Le vip a bien été modifié')
                } else {
                    callback(null, null)
                }
            },
            function (callback) {
                vipModel.getVipFromId(vip_num, (err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                nationaliteModel.getNationalites((err, result) => {
                    callback(null, result)
                });
            },
            function (callback) {
                jobsModel.getVipMariages(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                jobsModel.getVipNames((err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                jobsModel.getVipLiaisons(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                acteurModel.getActeurFromId(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                acteurModel.getVipRoles(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                jobsModel.getFilms((err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                realisateurModel.getVipFilms(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                chanteurModel.getChanteurFromId(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                chanteurModel.getAlbumsVip(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                jobsModel.getMaisonsDisque((err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                mannequinModel.getMannequinFromId(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                jobsModel.getAgences((err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                mannequinModel.getMannequinDefiles(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                jobsModel.getDefiles((err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                couturierModel.getCouturierDefiles(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                realisateurModel.getRealisateurFromId(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                mannequinModel.getMannequinAgence(vip_num, (err, result) => {
                    callback(null, result)
                })
            },
            function (callback) {
                couturierModel.getCouturierById(vip_num, (err, result) => {
                    callback(null, result)
                })
            }],
        (err, result) => {
            if (err) return console.error(err)

            response.vip = result[1];
            response.nationalites = result[2];
            response.conjoint = result[4];
            response.mariages = result[3];
            response.liaisons = result[5];
            response.films = result[8];
            response.acteur = result[6];
            response.roles = result[7];
            response.films_real = result[9];
            response.realisateur = result[18];
            response.maisons_de_disque = result[12];
            response.chanteur = result[10];
            response.albums = result[11];
            response.agences = result[14];
            response.mannequin_agence = result[19];
            response.mannequin = result[13];
            response.mannequin_defiles = result[15];
            response.defiles = result[16];
            response.couturier = result[20];
            response.couturier_defiles = result[17];


            response.render('editVIP', response);
        }
    );
};

module.exports.Index = function (request, response) {
    if (!request.session.username) {
        return response.redirect('/')
    }
    request.session.menu = 'vip';
    response.title = 'Admin Vip';
    async.parallel([
            function (callback) {
                vipModel.getAllVips((err, result) => {
                    callback(null, result)
                });
            }],
        (err, result) => {
            if (err) return console.error(err);

            let header = []
            for (const element in result[0][0]) {
                if (result[0][0].hasOwnProperty(element)) {
                    header.push(element)
                }
            }

            response.thead = header;
            response.vip = result[0];

            response.render('homeVip', response);
        });
};