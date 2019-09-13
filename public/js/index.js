const containerMain = $(".total-container");
const loader = $(".loader");
const loader1 = $(".loader1");
const nomoreresults = $(".nomoreresults");
const articlesDiv = $(".article-cards-div");
const searchDropdown = $(".search-dropdown")
const searchDiv = $(".search-div input");
const searchBtn = $(".search-but");
const footer = $("footer");
let loadmoreCount = 0;
let onscrollloader = true;
let category = "latest";

async function getData() {
    let url = `cardsdata/${category},${loadmoreCount}`
    const response = await fetch(url);
    let data = await response.json();
    loadmoreCount += 6;
    if (data.length > 0) {
        for (d of data) {
            let card = `<div class="parentcard">
                                <a class="category" href="/${d.cat}">${d.cat}</a>
                                <div class="sharediv">
                                    <img src="/images/share-alt-solid.svg" width="14" height="16.8" style="margin-top: 8.5px;">
                                </div>
                                <div class="share-drop">
                                    <a href="https://www.facebook.com/sharer/sharer.php?u=http://www.scienceversion.com/post/${d.url}-${d._id}"><img src="/images/facebook-square-brands (2).svg" width='25' style="margin: 5px"></a>
                                    <a href="https://twitter.com/intent/tweet?url=http://www.scienceversion.com/post/${d.url}-${d._id}"><img src="/images/twitter-square-brands.svg" width='25' style="margin: 5px"></a>
                                    <a href="https://api.whatsapp.com/send?text=http://www.scienceversion.com/post/${d.url}-${d._id}" data-action="share/whatsapp/share"><img src="/images/whatsapp-square-brands.svg" width='25' style="margin: 5px"></a>
                                </div>
                                <a href="post/${d.url}-${d._id}">
                                <div class="cards" style="background: url('${d.imageCardUrl}')">
                                    <div class="innerdiv"></div>
                                </div>
                                <text class="titletext">${d.title}</text>
                                </a>
                            </div>`
            articlesDiv.append(card)
        }
        
        $(".sharediv").on("click", function() {
            $(this).siblings(".share-drop:first").toggle();
        })

    } else {
        loader1.css("display", "none");
        nomoreresults.css("display", "block");
        onscrollloader = false
    }
}
getData().then(() => {
    loader.css("display", "none");
    containerMain.css("display", "block");
});

window.onscroll = () => {
    if (onscrollloader) {
        let _windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            _scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((_windowHeight + _scrollPos) >= document.body.offsetHeight / 1.3) {
            loader1.css("display", "block");
            getData();
        }
    }
}

let rightButton = $("#right-btn");
let leftButton = $("#left-btn");
let container = $("#StoryCont");
let slideCont = $("#story-slider");
let maxcount = $("#story-slider > a").length;
let marLeft = 0,
    maxX = maxcount * 157,
    diff = 0;

function slide() {
    marLeft -= 172;
    if (marLeft < -maxX) {
        marLeft = -maxX + 142;
    }
    slideCont.animate({
        "margin-left": marLeft + "px"
    }, 500);
}

function slideBack() {
    marLeft += 172;
    if (marLeft > 0) {
        marLeft = 0;
    }
    slideCont.animate({
        "margin-left": marLeft + "px"
    }, 500);
}
rightButton.click(slide);
leftButton.click(slideBack);

/*touch code from here*/

$(container).on("mousedown touchstart", function(e) {

    let startX = e.pageX || e.originalEvent.touches[0].pageX;
    diff = 0;

    $(container).on("mousemove touchmove", function(e) {

        let xt = e.pageX || e.originalEvent.touches[0].pageX;
        diff = (xt - startX) * 100 / window.innerWidth;
        if (marLeft == 0 && diff > 10) {
            event.preventDefault();
        } else if (marLeft == -maxX && diff < -10) {
            event.preventDefault();
        }
    });
});

$(container).on("mouseup touchend", function(e) {
    $(container).off("mousemove touchmove");
    if (marLeft == 0 && diff > 4) {
        sliderCont.animate({
            "margin-left": 0 + "px"
        }, 100);
    } else if (marLeft == -maxX && diff < 4) {
        sliderCont.animate({
            "margin-left": -maxX + "px"
        }, 100);
    } else {
        if (diff < -10) {
            slide();
        } else if (diff > 10) {
            slideBack();
        }
    }
});

searchDiv.on("input", () => search())

async function search() {
    searchDropdown.css("display", "block")
    const urlPara = searchDiv.val();
    if (urlPara.length == 0) {
        searchDropdown.html("")
        searchDropdown.css("display", "none")
    } else {
        const response = await fetch(`/search/${urlPara}`);
        const json = await response.json();
        if (json.length > 0) {
            searchDropdown.html("")
            for (j of json) {
                const searchdivs = `<a href="post/${j.url}-${j._id}"><div class="inner-searchresult">${j.title}<div class="dropdown-cat">${j.cat} &nbsp;&nbsp;&nbsp; ${j.date}</div></div></a>`
                searchDropdown.append(searchdivs)
            }
        } else {
            searchDropdown.html("")
            searchDropdown.append("<div style='line-height:50px;text-align:center;'>NO RESULTS FOUND</div>")
        }
    }
}

searchBtn.click(searchClick)

searchDiv.keydown((event) => {
    if (event.keyCode === 13) {
        event.preventDefault()
        searchClick();
    }
})

function searchClick() {
    $(".search-dropdown a")[0].click()
}

$(".tabs a").on('click', function() {
    $(".tabs a").removeClass("active")
    $(this).addClass("active")
    if ($(this).attr('name') == "trending") {
        articlesDiv.html("");
        loadmoreCount = 0;
        category = "trending";
        footer.css("display", "none");
        nomoreresults.css("display", "none");
        loader1.css("display", "block");
        getData().then(() => {
            onscrollloader = true;
            footer.css("display", "block");
            loader1.css("display", "none");
        });
    } else {
        articlesDiv.html("");
        loadmoreCount = 0;
        category = "latest";
        footer.css("display", "none");
        nomoreresults.css("display", "none");
        loader1.css("display", "block");
        getData().then(() => {
            onscrollloader = true;
            footer.css("display", "block");
            loader1.css("display", "none");
        });
    }
});