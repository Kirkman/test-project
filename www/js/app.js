$(document).ready(function($) {

    // These functions help determine the distance between the two coordinates.
    // Based on stackoverflow answer:  http://stackoverflow.com/a/4060721/566307
    function rad(x) {return x*Math.PI/180;}
    function updateDistances( location, dataFilter ) {
        var lat = location.coords.latitude;
        var lng = location.coords.longitude;
        var accuracy = location.coords.accuracy;
        // Remove the period from the dataFilter for use in .removeClass()
        var theClass = dataFilter.split('.')[1];
        // Extract target distance from the dataFilter ( which is in format ".within-5" )
        var theDistance = parseInt( dataFilter.split('-')[1] );

        var R = 6371;

        // Remove any location classes that might have been added earlier
        $('.grid')
            .removeClass( 'within-1' )
            .removeClass( 'within-3' )
            .removeClass( 'within-5' );

        // Iterate over each restaurant and calculate its distance from the user
        $('.grid').each( function( index ) {
            var $this = $(this);
            var latlngs = $this.attr('data-latlngs');
            // Only run this code on restaurants that have latlngs. This excludes food trucks and popups.
            if ( latlngs ) {
                // Some restaurants have multiple locations. 
                // In those cases, we store latlngs as semi-colon delimited lists
                latlngs = latlngs.split(';');
                // This array will hold each of this restaurant's locations' distance values
                var distances = [];
                // Iterate over each latlng pair for this restaurant and calculate distance from the user.
                for (var j=0; j< latlngs.length; j++) {
                    var latlng = latlngs[j].split(',');
                    var rlat = latlng[0];
                    var rlng = latlng[1];
                    var dLat  = rad(rlat - lat);
                    var dLong = rad(rlng - lng);
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c;
                    // need to convert d from kilometers to miles
                    d = d * 0.621371;
                    // Add this location's distance to the restaurant's array of distances
                    distances.push(d);
                }
                // Sort the array of distances from smallest to biggest.
                distances.sort().reverse();
                // Take the closest distance and add that to the restaurant's Isotope data.
                // FOR FUTURE: Make the list sortable by distance
                $this.attr('data-distance',distances[0]);
                // If the closest distance is within the target distance, tag with appropriate class so Isotope will show it when we filter.
                if ( distances[0] < theDistance ) {
                    $this.addClass( theClass );
                }
            }
        });

        // combine filters
        var filterValue = '';
        for ( var prop in filters ) {
            filterValue += filters[ prop ];
        }
        // set filter for Isotope
        $container.isotope({ filter: filterValue });
    }


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
            var dataFilter = $this.attr('data-filter');

            // Need to do some geolocating if they click "Near me"
            if ( dataFilter == '.within-1' || dataFilter == '.within-3' || dataFilter == '.within-5' ) {
                if (navigator.geolocation) {
                    var userLocation = navigator.geolocation.getCurrentPosition( function( location ) {
                        updateDistances( location, dataFilter );
                    });
                }
            }

            // set filter for group
            filters[ filterGroup ] = dataFilter;

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
            var dataFilter = $this.find(':selected').attr('data-filter');

            // Need to do some geolocating if they click "Near me"
            if ( dataFilter == '.within-1' || dataFilter == '.within-3' || dataFilter == '.within-5' ) {
                if (navigator.geolocation) {
                    var userLocation = navigator.geolocation.getCurrentPosition( function( location ) {
                        updateDistances( location, dataFilter );
                    });
                }
            }

            filters[filterGroup] = dataFilter;

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



