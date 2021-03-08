const nationaliteModel = require("../models/nationalite");
const vipModel = require("../models/vip");
const async = require("async");

module.exports.AddVIP = function(request, response){
    response.title = "Ajout d'un VIP";
    async.parallel([
            function (callback){
                nationaliteModel.getNationalites(function (err, result){callback(null, result)});
            }],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.nationalite = result[0]

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
        result = []
    let array = '';
    for(let dataKey in data) {
        array = array.concat(dataKey + ' : "' + data[dataKey] + '" , ')
        result[dataKey] = data[dataKey]
        if (dataKey.includes('acteur_film')) acteur.push(result[dataKey])
        if (dataKey.includes('real_film')) real.push(result[dataKey])
        if (dataKey.includes('chant_album')) chant.push(result[dataKey])
        if (dataKey.includes('model_defile')) model.push(result[dataKey])
        if (dataKey.includes('couturier_defile')) couturier.push(result[dataKey])
    }

    for (let i = 0; i < acteur.length; i+=2) {
        vipModel.addVipRole(acteur[i], acteur[i+1])
        console.log("Films joués : { Role : " + acteur[i] + ', Titre : ' + acteur[i+1] + ' }')
    }
    for (let i = 0; i < real.length; i+=2) {
        vipModel.addVipFilm(real[i], real[i+1])
        console.log("Films réalisés : { Date : " + real[i] + ', Titre : ' + real[i+1] + ' }')
    }
    for (let i = 0; i < chant.length; i+=3) {
        vipModel.addVipAlbum(chant[i], chant[i+1], chant[i+2])
        console.log("Albums réalisés : { Date : " + chant[i] + ', Titre : ' + chant[i+1] + ', Maison de disque : ' + chant[i+2] + ' }')
    }
    for (let i = 0; i < model.length; i+=2) {
        vipModel.addVipDefile(model[i], model[i+1])
        console.log("Defilés réalisés : { Date : " + model[i] + ', Lieu : ' + model[i+1] + ' }')
    }
    for (let i = 0; i < couturier.length; i+=2) {
        vipModel.addVipDefileOrga(couturier[i], couturier[i+1])
        console.log("Défilés organisés : { Date : " + couturier[i] + ', Lieu : ' + couturier[i+1] + ' }')
    }
    console.log(result)

    response.array = array;

    response.render('requestAdd', response);
};