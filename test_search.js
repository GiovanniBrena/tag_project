/**
 * Created by Giovanni on 14/06/2016.
 */

var get_artist_url = "http://api.bandsintown.com/artists/";
var get_events_by_artist_url = "";
var app_id = "?api_version=2.0&app_id=YOUR_APP_ID";


function getArtistData() {
    $(".artist-container .item").hide();
    $(".loading").show();

    var param = document.getElementById("query").value;
    $("#concert-container").empty();

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
            console.log( response ); // server response

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
            console.log( response ); // server response
            $("#concert-container").append("<h3>Next shows:</h3>");

            if (typeof response !== 'undefined' && response.length > 0) {
                for (var i = 0; i < 4; i++) {
                    if (i == response.lenght) {
                        break;
                    }
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