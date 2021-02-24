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

$('.profile-photo').hover(function (){
        $(this).parent().siblings('a').children('.profile-photo:visible').css('filter', 'blur(2px)')
    }, function (){
        $(this).parent().siblings('a').children('.profile-photo:visible').removeAttr('style')
    })

/*-----*/

let pplist = $(".profile-photo");
const pas = 12;
const nbpages = Math.trunc(pplist.length/pas)
let pageid=0;

function changePage(page) {
    showButtons(page)
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

function showButtons(page) {
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

function changeImg(image) {
    
}

$(document).ready(function () {
    $('#pplist').append('<div id="pagination">');
    $('#pagination')
        .append('<button id="start" class="left">Début</button>')
        .append('<button id="previous" class="left">Précédent</button>')
        .append('<button id="next" class="right">Suivant</button>')
        .append('<button id="end" class="right">Fin</button>')
    changePage(pageid)
    $('#start').on('click', function (){pageid=0;changePage(pageid)})
    $('#previous').on('click', function (){changePage(--pageid)})
    $('#next').on('click', function (){changePage(++pageid)})
    $('#end').on('click', function (){pageid=nbpages;changePage(pageid)})

    $('#albumVip')
        .prepend('<button id="prev-img">Precedent</button>')
        .append('<button id="next-img">Suivant</button>')
    $('#prev-img').on('click', function () {changeImg($('.photoVip:visible').data('') + 1)})
})
