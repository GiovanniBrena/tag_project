/**
 * Created by Giovanni on 28/06/2016.
 */
var looper;
var degrees = 0;
var speed = 20;
function rotateAnimation(el) {
    var elem = document.getElementById(el);
    if (navigator.userAgent.match("Chrome")) {
        elem.style.WebkitTransform = "rotate(" + degrees + "deg)";
    } else {
        elem.style.transform = "rotate(" + degrees + "deg)";
    }
    looper = setTimeout('rotateAnimation(\'' + el + '\',' + speed + ')', speed);
    degrees++;
    if (degrees > 359) {
        degrees=1;
    }
}

$("#btn").mousedown(function () {
    $("#face").attr('src', 'imgs/gb_faccia-flames.png');
}).mouseup(function () {
    $("#face").attr('src', 'imgs/gb_faccia.png');
});

function sliderChangeValue() {
    speed = 30 - $("#slider-input").val();
    $("#rangevalue").val(30-speed);
}


rotateAnimation("face");