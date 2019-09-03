const title = $("header .title");
const header = $("header");
const logo = $(".logo");
const apps = $("header .apps")
const but = $("header .but");
const butimg = $("header .but-img");

$(".sharebut").on("click", function() {
    $(this).siblings(".share-drop:first").toggle();
})

window.onscroll = () => {
    scrollnav();
}

function scrollnav() {
    if (document.body.scrollTop > 170 || document.documentElement.scrollTop > 170) {
        header.css("height", "68px");
        logo.css("width", "170px");
        logo.css("margin", "7px 0 0 10px");
        for (x = 0; x < apps.length; x++) {
            apps[x].classList.remove("v");
            apps[x].style.width = "90px"
            but[x].classList.add("but-scroll");
            title[x].style.display = "none";
            if (x == 0) {
                butimg[x].style.width = "40px"
            } else if (x <= 4) {
                butimg[x].style.width = "30px"
            } else if (x <= 7) {
                butimg[x].style.width = "20px"
            }
        }
    } else {
        header.css("height", "100px");
        logo.css("width", "180px");
        logo.css("margin", "23px 0 0 10px");
        for (x = 0; x < apps.length; x++) {
            apps[x].classList.add("v");
            apps[x].style.width = "97px"
            but[x].classList.remove("but-scroll");
            title[x].style.display = "inline-block";
            if (x == 0) {
                butimg[x].style.width = "60px"
            } else if (x <= 4) {
                butimg[x].style.width = "50px"
            } else if (x <= 7) {
                butimg[x].style.width = "40px"
            }
        }
    }
}

var modal = $('#myModal');

var btn = $("#myBtn");

var span = $(".close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.css("display", "none");
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.css("display", "none");
    }
}