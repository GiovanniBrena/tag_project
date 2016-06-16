/**
 * Created by Giovanni on 14/06/2016.
 */

var get_artist_url = "http://api.bandsintown.com/artists/";
var get_artist_id_url = "https://api.spotify.com/v1/search?query=";
var get_related_artists_url = "https://api.spotify.com/v1/artists/";



function getArtistData() {
    $(".artist-container .item").hide();
    $(".loading").show();

    var param = document.getElementById("query").value;
    $("#concert-container").empty();
    $("#related-container").empty();

    $.ajax({
        url: get_artist_url+param+".json?api_version=2.0&app_id=1518664261769373",

        // The name of the callback parameter, as specified by the YQL service
        jsonp: "callback",

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Tell YQL what we want and that we want JSON
        data: {
            q: "select title,abstract,url from search.news where query=\"cat\"",
            format: "json"
        },

        // Work with the response
        success: function( response ) {
            if(response.hasOwnProperty('errors')&&response.errors[0]=="Unknown Artist"){
                $("#artist-name").html("artist not found");
                $("#artist-fb-link").html("try another one!");
                $("#artist-icon").one("load", function() {
                    $(".loading").hide();
                    $(".artist-container .item").show();
                }).attr("src", "imgs/sad-smile.png");
                $("#concert-container").hide();
                return;
            }

            $("#artist-name").html(response.name);
            $("#artist-fb-link").html(response.facebook_page_url).attr("href",response.facebook_page_url);
            $("#artist-icon").one("load", function() {
                $(".loading").hide();
                $(".artist-container .item").show();
            }).attr("src", response.thumb_url);
        }
    });
    getNextConcerts(param);
    getArtistId(param);
    return false;
}

function getNextConcerts(artistName){
    $("#concert-container").show();
    $.ajax({
        url: get_artist_url+artistName+"/events.json?api_version=2.0&app_id=1518664261769373",

        // The name of the callback parameter, as specified by the YQL service
        jsonp: "callback",

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Tell YQL what we want and that we want JSON
        data: {
            q: "select title,abstract,url from search.news where query=\"cat\"",
            format: "json"
        },

        // Work with the response
        success: function( response ) {
            $("#concert-container").append("<h3>Next shows:</h3>");

            if (typeof response !== 'undefined' && response.length > 0) {
                for (var i = 0; i < 4 && i<response.length; i++) {
                    var event = response[i];
                    var event_title = event.title;
                    var event_date = event.formatted_datetime;
                    var event_location = event.formatted_location;

                    $("#concert-container").append('<div class="item"><div class="item"><h4>' + event_date
                        + '<h5>' + event_title + '</h5><h6>' + event_location + '</h6></div></div>')

                }

            }
            else {$("#concert-container").append("<h5>No shows found for this artist.</h5>");}
        }
    });

    return false;
}

function getArtistId(artistName){
    $.getJSON( get_artist_id_url+artistName+"&offset=0&limit=20&type=artist", function( data ) {
        if(data.artists.items.length>0) {
            var artist_id = data.artists.items[0].id;
            getRelatedArtists(artist_id);
        }
    });
}

function getRelatedArtists(artistId) {
    $.getJSON( get_related_artists_url+artistId+"/related-artists", function( data ) {
        if(data.artists.length>0) {
            $("#related-container").append('<h3>Related:</h3>');
            for(var i=0; i<4&&i<data.artists.length; i++) {
                var artist = data.artists[i];
                $("#related-container").append('<div class="item related-item"><img src="'+artist.images[0].url+'"><h5>'+artist.name+'</h5></div>')
            }
        }
    });
}