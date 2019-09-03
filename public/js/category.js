const containerMain = $(".total-container");
const loader = $(".loader");
const loader1 = $(".loader1");
const nomoreresults = $(".nomoreresults");
const articlesDiv = $(".article-cards-div");
const title = $("header .title");
const header = $("header");
const logo = $(".logo");
const apps = $("header .apps")
const but = $("header .but");
const butimg = $("header .but-img");
const category = window.location.pathname.split("/")[1].toLowerCase()
let loadmoreCount = 0;
let onscrollloader = true;

async function getData() {
    let url = `categorydata/${loadmoreCount},${category}`
    const response = await fetch(url);
    const data = await response.json();
    loadmoreCount += 6;
    if (data.length > 0) {
        for (d of data) {
            let card = `<div class="parentcard">
                                <a class="category" href="/${d.cat}">${d.cat}</a>
                                <div class="sharediv">
                                    <img src="/images/share-alt-solid.svg" width="14px" height="16.8px" style="margin-top: 8.5px;">
                                </div>
                                <div class="share-drop">
                                    <img src="/images/facebook-square-brands (2).svg" width='25' style="margin: 5px">
                                    <img src="/images/twitter-square-brands.svg" width='25' style="margin: 5px">
                                    <img src="/images/whatsapp-square-brands.svg" width='25' style="margin: 5px">
                                </div>
                                <a href="post/${d.url}-${d._id}">
                                <div class="cards" style="background: url('${d.imageCardUrl}')">
                                    <div class="innerdiv"></div>
                                </div>
                                <text class="titletext">${d.title}</text>
                                </a>
                            </div>`
            articlesDiv.append(card);
        }
        $(".sharediv").on("click", function() {
            $(this).siblings(".share-drop:first").toggle();
        })

    } else {
        loader1.css('display', 'none');
        nomoreresults.css("display", "block");
        onscrollloader = false
    }
}
getData().then(() => {
    loader.css("display", "none");
    containerMain.css("display", "block");
});

window.onscroll = () => {
    onscrollload();
    scrollnav()
}

function onscrollload() {
    if (onscrollloader) {
        let _windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            _scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((_windowHeight + _scrollPos) >= document.body.offsetHeight / 1.3) {
            loader1.css("display", "block");
            getData();
        }
    }
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
// Get the modal
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