$(document).ready(function($) {

    // Only run this code on pages that actually have an imageGallery
    if ( $('#imageGallery').length ) {

        $('#imageGallery').lightSlider({
            // gallery: true,
            auto:true,
            loop:true,
            item: 1,
            thumbItem: 12,
            slideMargin: 0,
            speed: 1000, //ms'
            pause: 5000,
            currentPagerPosition: 'left',
            onSliderLoad: function(plugin) {
                plugin.lightGallery({
                    selector: ".lslide"
                });
            }
        });
    } // end if imagegallery

    if ( $('.isotope').length ) {

        // init Isotope
        var $container = $('.isotope').isotope({
            itemSelector: '.grid'
        });

        // store filter for each group
        var filters = {};

        $('.filters').on( 'click', '.button', function() {
            var $this = $(this);
            // get group key
            var $buttonGroup = $this.parents('.button-group');
            var filterGroup = $buttonGroup.attr('data-filter-group');
            // set filter for group
            filters[ filterGroup ] = $this.attr('data-filter');
            // combine filters
            var filterValue = '';
            for ( var prop in filters ) {
                filterValue += filters[ prop ];
            }
            // set filter for Isotope
            $container.isotope({ filter: filterValue });
        });


        $('select').change(function() {
            var $this = $(this);

            $('select .disabled-select').attr('disabled', 'disabled');

            // store filter value in object
            // i.e. filters.color = 'red'
            var filterGroup = $this.attr('data-filter-group');

            filters[filterGroup] = $this.find(':selected').attr('data-filter');

            // convert object into array
            var filterValue = [];
            for (var prop in filters) {
                filterValue.push(filters[prop]);
            }

            var selector = filterValue.join('');
            $container.isotope({
                filter: selector
            });
            return false;
        });


        // change is-checked class on buttons
        $('.button-group').each( function( i, buttonGroup ) {
            var $buttonGroup = $( buttonGroup );
            $buttonGroup.on( 'click', 'button', function() {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $( this ).addClass('is-checked');
            });
        });

    } // end if isotope


    $(".popup").click(function() {
        var t = 575,
            e = 400,
            i = ($(window).width() - t) / 2,
            o = ($(window).height() - e) / 2,
            a = this.href,
            n = "status=1,width=" + t + ",height=" + e + ",top=" + o + ",left=" + i;
        return window.open(a, "twitter", n), !1
    });


    $(function() {
        var prevScroll = 0,
            curDir = 'down',
            prevDir = 'up';

        $(window).scroll(function() {
            if ($(this).scrollTop() >= prevScroll) {
                curDir = 'down';
                if (curDir !== prevDir) {
                    $('.nav-slide').stop();
                    $('.prev').animate({
                        left: '0px'
                    }, 300);
                    $('.next').animate({
                        right: '0px'
                    }, 300);
                    prevDir = curDir;
                }
            } else {
                curDir = 'up';
                if (curDir !== prevDir) {
                    $('.nav-slide').stop();
                    $('.prev').animate({
                        left: '-60px'
                    }, 300);
                    $('.next').animate({
                        right: '-60px'
                    }, 300);
                    prevDir = curDir;
                }
            }
            prevScroll = $(this).scrollTop();
        });
    });



}); // end jquery ready handler



