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
        $('#start, #previous, #next, #end').attr('disabled', 'disabled');
    } else {
        if (page === 0) {
            $('#next, #end').removeAttr('disabled');
            $('#start, #previous').attr('disabled', 'disabled');
        } else if (page === nbpages) {
            $('#next, #end').attr('disabled', 'disabled');
            $('#start, #previous').removeAttr('disabled');
        } else {
            $('#start, #previous, #next, #end').removeAttr('disabled');
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

let film_num, real_num, chant_num, model_num, couturier_num, mariage_num, liaison_num;

$(document).ready(function(){
    $('.job-name').siblings('.job-detail').hide();
    $('.rupture_mariage, .rupture_liaison').parent().siblings('.rupture').hide();
    $('input[type=checkbox].unchecked').each(function(){
        $(this)[0].checked = false;
    })

    mariage_num = Number(($("[id^=mariage_vip_lieu_]").last().attr('id') || "-1").replace("mariage_vip_lieu_", ""))+1;
    liaison_num = Number(($("[id^=liaison_vip_date_]").last().attr('id') || "-1").replace("liaison_vip_date_", ""))+1;
    film_num = Number(($("[id^=acteur_titre_]").last().attr('id') || "-1").replace("acteur_titre_", ""))+1;
    real_num = Number(($("[id^=real_date_]").last().attr('id') || "-1").replace("real_date_", ""))+1;
    chant_num = Number(($("[id^=album_date_]").last().attr('id') || "-1").replace("album_date_", ""))+1;
    model_num = Number(($("[id^=model_lieu_]").last().attr('id') || "-1").replace("model_lieu_", ""))+1;
    couturier_num = Number(($("[id^=couturier_date_]").last().attr('id') || "-1").replace("couturier_date_", ""))+1;

})

$('.rupture_mariage, .rupture_liaison').siblings('input[type=checkbox]').on('click', function() {
    if ($(this)[0].checked){
        $(this).parent().siblings('.rupture').show();
    } else {
        $(this).parent().siblings('.rupture').hide();
    }
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

$('input[type=checkbox]').each(function(){
    $(this).ready(() => {
        if ($(this)[0].checked){
            $(this).siblings('.job-detail').show();
            $(this).parent().siblings('.rupture').show();
        } else {
            $(this).siblings('.job-detail').hide();
            $(this).parent().siblings('.rupture').hide();
        }
    })
});

$('.addItem').each(function(){
    $(this).on('click',function(){
        switch ($(this).attr('id')) {
            case 'acteur-add' :
                let options_film_str;
                $('#select_roles').clone().children().each(function() {
                    $(this).removeAttr('selected');
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
                $(this).before(`<div class="col-6">
                                <input type="hidden" name="real_film_num_${real_num}" value="">
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
                $('#select_maison').clone().children().each(function() {
                    $(this).removeAttr('selected');
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
                $('#select_defile').clone().children().each(function() {
                    $(this).removeAttr('selected');
                    options_defile_str += $(this)[0].outerHTML
                })
                $(this).before(`<div>
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
                $(this).before(`<div class="col-6">
                                <input type="hidden" name="couturier_defile_num_${couturier_num}" value="">
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
                </div>`);
                break;
            case 'mariage-add' :
                let options_conjoint_str;
                $('#select_conjoint').clone().children().each(function() {
                    $(this).removeAttr('selected');
                    options_conjoint_str += $(this)[0].outerHTML
                })
                $(this).before(`<div class="col-6">
                        <div class="form-item">
                            <label for="mariage_vip_date_${mariage_num}">Date : </label>
                            <input type="date" name="mariage_vip_date_${mariage_num}" id="mariage_vip_date_${mariage_num}">
                        </div>
                        <div class="form-item">
                            <label for="mariage_vip_lieu_${mariage_num}">Lieu : </label>
                            <input type="text" name="mariage_vip_lieu_${mariage_num}" id="mariage_vip_lieu_${mariage_num}">
                        </div>
                        <div class="form-item">
                            <label for="mariage_vip_conjoint_${mariage_num}">Conjoint : </label>
                            <select name="mariage_vip_conjoint_${mariage_num}" id="mariage_vip_conjoint_${mariage_num}">
                                ${options_conjoint_str}
                            </select>
                        </div>
                        <div class="form-item checkbox">
                            <input type="checkbox" id="mariage_vip_rupture_checkbox_${mariage_num}" name="rupture_mariage_${mariage_num}">
                            <label for="mariage_vip_rupture_checkbox_${mariage_num}" class="rupture_mariage">Rupture</label>
                        </div>
                        <div class="form-item rupture">
                            <label for="mariage_vip_date_fin_${mariage_num}">Date : </label>
                            <input type="date" name="mariage_vip_date_fin_${mariage_num}" id="mariage_vip_date_fin_${mariage_num}">
                        </div>
                        <div class="form-item rupture">
                            <label for="mariage_vip_motif_fin_${mariage_num}">Motif : </label>
                            <input type="text" name="mariage_vip_motif_fin_${mariage_num}" id="mariage_vip_motif_fin_${mariage_num}">
                        </div>
                    </div>`)
                $(`#mariage_vip_rupture_checkbox_${mariage_num}`).on('click', function() {
                        if ($(this)[0].checked){
                            $(this).parent().siblings('.rupture').show();
                        } else {
                            $(this).parent().siblings('.rupture').hide();
                        }
                    }).parent().siblings('.rupture').hide();
                mariage_num++
                break;
            case 'liaison-add' :
                let options_amant_str;
                $('#select_amant').clone().children().each(function() {
                    $(this).removeAttr('selected');
                    options_amant_str += $(this)[0].outerHTML
                })
                $(this).before(`<div class="col-6">
                            <div class="form-item">
                                <label for="liaison_vip_date_${liaison_num}">Date : </label>
                                <input type="date" name="liaison_vip_date_${liaison_num}" id="liaison_vip_date_${liaison_num}">
                            </div>
                            <div class="form-item">
                                <label for="liaison_vip_amant_${liaison_num}">Amant : </label>
                                <select name="liaison_vip_amant_${liaison_num}" id="liaison_vip_amant_${liaison_num}">
                                    ${options_amant_str}
                                </select>
                            </div>
                            <div class="form-item checkbox">
                                <input type="checkbox" id="liaison_vip_rupture_checkbox_${liaison_num}" name="rupture_liaison_${liaison_num}">
                                <label for="liaison_vip_rupture_checkbox_${liaison_num}" class="rupture_liaison">Rupture</label>
                            </div>
                            <div class="form-item rupture">
                                <label for="liaison_vip_motif_fin_${liaison_num}">Motif : </label>
                                <input type="text" name="liaison_vip_motif_fin_${liaison_num}" id="liaison_vip_motif_fin_${liaison_num}">
                            </div>
                        </div>`)
                $(`#liaison_vip_rupture_checkbox_${liaison_num}`).on('click', function() {
                    if ($(this)[0].checked){
                        $(this).parent().siblings('.rupture').show();
                    } else {
                        $(this).parent().siblings('.rupture').hide();
                    }
                }).parent().siblings('.rupture').hide();
                liaison_num++
                break;
            default: break;
        }
    })
})


$('[id^=preview_photo_delete_]').hide();
$('#photo_to_delete').on('change', function() {
    $('[id^=preview_photo_delete_]').hide();
    let image = $('#preview_photo_delete_'+$(this).val())
    image.show()
    $('.photo_to_delete_name').remove()
    $('[id^=preview_photo_delete_]:visible')
        .after(`<input type="hidden" name="photo_to_delete_name" class="photo_to_delete_name" value="${image.attr('alt')}">`);
})

$('select#vip_selected').on('change', function(e) {
    e.preventDefault();
    location.href = `${location.origin}/photo/${$('#vip_selected').val()}`
})

$('form#delete_vip').on('submit', function(e) {
    e.preventDefault();
    location.href = `${location.origin}/vip/delete/${$('#vip_to_delete').val()}`
})

$('[data-id^=article_preview_]:not([data-id=article_preview_])').hide()
$('#article_to_delete').on('change', function() {
    $('[data-id^=article_preview]').hide();
    $(`[data-id=article_preview_${$(this).val()}]`).show()
})

$('#article_to_edit').on('change', function() {
    $('[data-id^=article_preview]').hide();
    let preview = $(`[data-id=article_preview_${$(this).val()}]`)
    preview.show()
    preview.on('keyup paste', function() {
        $('#article_edited').val(preview.val())
    })
    $('#article_edited').val(preview.val())
})

$('table#vip_table').sortable({sortMode: 'page' })