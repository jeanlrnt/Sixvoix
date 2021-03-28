/**
 Plugin de personnalisation du tableau
 **/
(function ( $ ) {
    $.fn.sortable = function( options ) {

        let defaultSetting = { sortMode:"base" };
        let settings = $.extend(defaultSetting, options);

        return this.each(function(){
            let elem = $(this);
            let arr ='<span><i class="icon fas"></i></span>';

            var sortBase =function(colonne, sens){
                console.log("base:",colonne,sens)
            };

            var sortPage = function(colonne, sens) {
                let rows = elem.find('tbody>tr')
                rows.sort(function (a, b) {
                    let $a = $(a).find('.' + colonne).text();
                    let $b = $(b).find('.' + colonne).text();
                    return sens === 1 ? $a.localeCompare($b) : $b.localeCompare($a)
                })
                rows.each(function (i, row) {
                    $(row).appendTo(elem)
                })
            }

            let th=elem.find('th');
            th.each(function(i,elt){
                $(elt).data('field', $(elt).attr('class')).addClass('sortable')
            })
            th.contents().wrap('<span class="field"></span>');
            th.prepend(arr)
                .on('click', function(){
                    let t = $(this);
                    t.addClass('active');
                    let ico = t.find('.icon');
                    let ico_down = 'fa-sort-alpha-up';
                    let ico_up = 'fa-sort-alpha-down';
                    let sens;
                    if (ico.is('.'+ico_up)) {
                        ico.removeClass(ico_up).addClass(ico_down)
                        sens = -1
                    } else {
                        ico.removeClass(ico_down).addClass(ico_up)
                        sens = 1
                    }
                    let siblings = t.siblings().removeClass('active');
                    siblings.find('i').removeClass(ico_up).removeClass(ico_down);

                    if (settings.sortMode.toLocaleLowerCase() === "page") {
                        sortPage(t.data('field'), sens);
                    } else {
                        sortBase(t.data('field'), sens);
                    }
                })

        });
    };
}( jQuery ));
