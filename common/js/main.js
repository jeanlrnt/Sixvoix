$("a.link-vip").hover(function(){
        $(this).parent().siblings("div").show();
        $(this).mousemove(function(event){
            let left = event.pageX + 50;
            let top = event.pageY - 20;
            $(this).parent().siblings("div").css({top: top,left: left});
        })
    }, function(){
        $(this).parent().siblings("div").hide();
    }
);

$('.profile-photo:visible').css('filter', 'grayscale(80%)').hover(function (){
        $(this).removeAttr('style')
        $(this).parent().siblings('a').children('.profile-photo:visible').css('filter', 'grayscale(80%) blur(2px)')
    }, function (){
        $('.profile-photo:visible').css('filter', 'grayscale(80%)')
    })

/*-----*/

$(document).ready(function () {
    profileList()
    photoList()
    checkPageSelected();
})

let pplist = $(".profile-photo");
const pas = 12;
const nbpages = Math.trunc(pplist.length/pas)
let pageid=0;

function profileList(){
    $('#pplist').append('<div id="pagination">');
    $('#pagination')
        .append('<button id="start" class="left">Début</button>')
        .append('<button id="previous" class="left">Précédent</button>')
        .append('<button id="end" class="right">Fin</button>')
        .append('<button id="next" class="right">Suivant</button>')
    changePage(pageid)
    $('#start').on('click', function (){pageid=0;changePage(pageid)})
    $('#previous').on('click', function (){changePage(--pageid)})
    $('#next').on('click', function (){changePage(++pageid)})
    $('#end').on('click', function (){pageid=nbpages;changePage(pageid)})
}

function changePage(page) {
    showButtonsPagination(page)
    showPageSelected(page)
}

function showPageSelected(page) {
    pplist.each(function (i) {
        if (i < (page * pas) || i >= (page * pas) + pas) {
            $(this).hide()
        } else {
            $(this).show()
        }
    });
}

function showButtonsPagination(page) {
    if (page < 0 || page > nbpages) {
        $('#start, #previous, #next, #end').hide();
    } else {
        if (page === 0) {
            $('#next, #end').show();
            $('#start, #previous').hide();
        } else if (page === nbpages) {
            $('#next, #end').hide();
            $('#start, #previous').show();
        } else {
            $('#start, #previous, #next, #end').show();
        }
    }
}

function checkPageSelected(){
    let vip = $('#vipName').data('vip')
    pplist.each(function (i){
        if ($(this).data('vip') === vip){
            pageid = Math.trunc(i/pas)
            changePage(pageid);
        }
    })
}

let photoVipId = 0;
const photoVipNum = $('.photoVip').length;

function photoList(){
    $('#albumVip')
        .prepend('<div id="div-prev"><p id="prev-img">&lt;</p></div>')
        .append('<div id="div-next"><p id="next-img">&gt;</p></div>')
    changeImg(photoVipId)
    $('#prev-img').on('click', function() {changeImg(--photoVipId)})
    $('#next-img').on('click', function() {changeImg(++photoVipId)})
}

function changeImg(image) {
    showButtonImg(image)
    showImg(image)
    showComment(image)
}

function showComment(image){
    $('.commentImg').each(function(i){
        if (i === image){
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function showImg(image) {
    showButtonImg(image)
    $('.photoVip').each(function (i){
        if (i === image){
            $(this).show();
        } else {
            $(this).hide();
        }
    })
}

function showButtonImg(image){
    if (image < 0 || image >= photoVipNum || photoVipNum === 1) {
        $('#prev-img, #next-img').hide();
    } else {
        if (image === 0) {
            $('#next-img').show();
            $('#prev-img').hide();
        } else if (image >= photoVipNum - 1) {
            $('#next-img').hide();
            $('#prev-img').show();
        } else {
            $('#prev-img, #next-img').show();
        }
    }
}

let film_num, real_num, chant_num, model_num, couturier_num;

$(document).ready(function(){
    $('.job-name').siblings('.job-detail').hide();
    $('input[type=checkbox]').each(function(){
        $(this)[0].checked = false;
    })
    film_num = model_num = chant_num = 1;
    real_num = couturier_num = 0;
})

$('.job-name').each(function (){
    $(this).siblings('input[type=checkbox]').on('click',function(){
        if ($(this)[0].checked){
            $(this).siblings('.job-detail').show();
        } else {
            $(this).siblings('.job-detail').hide();
        }
    })
})

$('.addItem').each(function(){
    $(this).on('click',function(){
        switch ($(this).attr('id')) {
            case 'acteur-add' :
                let options_film_str;
                $('#acteur_titre_0').children().each(function() {
                    options_film_str += $(this)[0].outerHTML
                })
                $(this).parent().append(`<div class="form-item">
                            <label for="acteur_role_${film_num}">Rôle : </label>
                            <input type="text" name="acteur_film_role_${film_num}" id="acteur_role_${film_num}">
                        </div>
                        <div class="form-item">
                            <label for="acteur_titre_${film_num}">Film : </label>
                            <select name="acteur_film_titre_${film_num}" id="acteur_titre_${film_num}">
                                ${options_film_str}
                            </select>
                        </div>`)
                film_num++
                break;
            case 'realisateur-add' :
                $(this).parent().append(`<div class="col-6">
                        <div class="form-item">
                            <label for="real_date_${real_num}">Date réalisation : </label>
                            <input type="date" name="real_film_date_${real_num}" id="real_date_${real_num}">
                        </div>
                        <div class="form-item">
                            <label for="real_titre_${real_num}">Film : </label>
                            <input type="text" name="real_film_titre_${real_num}" id="real_titre_${real_num}">
                        </div>
                    </div>`)
                real_num++
                break;
            case 'chanteur-add' :
                let options_maison_str;
                $('#album_prod_0').children().each(function() {
                    options_maison_str += $(this)[0].outerHTML
                })
                $(this).parent().parent().append(`<div class="col-6">
                        <div class="form-item">
                            <label for="album_date_${chant_num}">Date de sortie : </label>
                            <input type="date" name="chant_album_date_${chant_num}" id="album_date_${chant_num}">
                        </div>
                        <div class="form-item">
                            <label for="album_titre_${chant_num}">Titre : </label>
                            <input type="text" name="chant_album_titre_${chant_num}" id="album_titre_${chant_num}">
                        </div>
                        <div class="form-item">
                            <label for="album_prod_${chant_num}">Maison de disque : </label>
                            <select name="chant_album_prod_${chant_num}" id="album_prod_${chant_num}">
                                ${options_maison_str}
                            </select>
                        </div>
                    </div>`)
                chant_num++
                break;
            case 'mannequin-add' :
                let options_defile_str;
                $('#model_lieu_0').children().each(function() {
                    options_defile_str += $(this)[0].outerHTML
                })
                $(this).parent().append(`<div>
                        <div class="col-6">
                            <div class="form-item">
                                <label for="model_lieu_${model_num}">Défilé ${model_num + 1} : </label>
                                <select name="model_defile_lieu_${model_num}" id="model_lieu_${model_num}">
                                    ${options_defile_str}
                                </select>
                            </div>
                        </div>
                    </div>`)
                model_num++
                break;
            case 'couturier-add' :
                $(this).parent().append(`<div class="col-6">
                        <div class="form-item">
                            <label for="couturier_date_${couturier_num}">Date : </label>
                            <input type="date" name="couturier_defile_date_${couturier_num}" id="couturier_date_${couturier_num}">
                        </div>
                        <div class="form-item">
                            <label for="couturier_lieu_${couturier_num}">Lieu : </label>
                            <input type="text" name="couturier_defile_lieu_${couturier_num}" id="couturier_lieu_${couturier_num}">
                        </div>
                    </div>`)
                couturier_num++
                break;
            case 'photo-add' :
                $(this).parent().append(`<div>
                    <div class="form-item">
                        <label for="image_file">Séléctionner une photo : </label>
                        <input type="file"
                               name="image_file"
                               id="image_file"
                               accept=".jpg,.png,.jpeg"
                               required>
                    </div>
                    <div class="col-6">
                        <div class="form-item">
                            <label for="image_sujet">Sujet : </label>
                            <textarea name="image_sujet" id="image_sujet" rows="2"></textarea>
                        </div>
                        <div class="form-item">
                            <label for="image_detail">Detail : </label>
                            <textarea name="image_detail" id="image_detail" rows="2"></textarea>
                        </div>
                    </div>
                </div>`)
            default: break;
        }
    })
})