var cities = JSON.parse(localStorage.getItem("cities")) || [];
renderButtons(cities);
if(cities.length > 0) {
    displayWeatherInfo(cities[cities.length-1]); //displays the last city added to the array
}

// Function to save city into local storage
function saveCity() {
    var value = $("#search-term").val(); //defines the input text as var value
    var key = $("#search-term").attr("id"); //defines the id as var key
    if (cities.indexOf(value) === -1) {
        cities.push(value);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
    renderButtons(cities);
}

var citiesSearchedEl = document.querySelector("#citiesSearched");
var runSearchEL = document.querySelector("#run-search");

var lat; //globally declaring the lat coord
var lon; //globally declaring the lon coord
var citiesSearched = []; //array to populate with cities

// function renderCities() {
//     citiesSearchedEl.innerHTML = "";

//     for (var i = 0; i < citiesSearched.length; i++) {
//         var lastCity = citiesSearched[i];
//         var li = document.createElement("li");
//         li.textContent = lastCity[i];
//         citiesSearchedEl.appendChild(li);
//     }
// }
function searchWeather() {
    //calling the function to save the city searched for in localStorage
    saveCity();
    event.preventDefault();

    //defining the city in the search bar so we can use it to create the URLs
    var city = $("#search-term").val();
    displayWeatherInfo(city);
}
function displayWeatherInfo(city) {
    
    //URL for pulling current data for city searched
    var queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=50d3e80e6321cb90f476e742b5c7daef";

    //URL for pulling forecast data for city searched
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=50d3e80e6321cb90f476e742b5c7daef";

    $.ajax({
        url: queryCurrentURL,
        method: "GET"
    }).then(function (response) {

        // var today = new Date();
        // var dd = String(today.getDate())padStart(2, "0");
        // var mm = String(today.getMonth() + 1).padStart(2, "0");
        // var yyyy = today.getFullYear();
        // today = mm + "/" + dd + "/" + yyyy;
        var day = new Date().toJSON().slice(0,10).replace(/-/g, "/");
        lat = response.coord.lat; //pulls the lat coord so we can eventually get UV Index
        lon = response.coord.lon; //pulls the lon coord so we can eventually get UV Index
        var iconCode = response.weather[0].icon; //pulls icon code so we can later add it to the url to pull the icon

        //url needed based on the icon associated with the weather
        var iconURL = ("http://openweathermap.org/img/wn/" + iconCode + "@2x.png");

        //displays name of city searched and icon for current weather
        $(".city").html("<h1>" + response.name + "</h1>");
        $(".date").html(day);
        $(".icon").html("<img src=" + iconURL + ">");

        //displays wind speed pulled from current weather api object for city searched
        $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");

        //displays humidity pulled from current weather api object for city searched
        $(".humidity").text("Humidity: " + response.main.humidity + "%");

        //converts temp from kelvin to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        //converts temp from kelvin to celsius
        var tempC = (response.main.temp - 273.15);

        //displays temp in both F and C pulled from current weather api object for city searched
        $(".tempF").text("Temperature: " + tempF.toFixed(1) + "°F " + "(" + tempC.toFixed(1) + "°C)");

        //URL for pulling UV Index data for city searched based off of coord of said city
        var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=50d3e80e6321cb90f476e742b5c7daef&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (UVResponse) {

            //varys the background color of UVIndex display based on value of UV Index returned
            if (UVResponse.value < 11 && UVResponse.value > 7) {
                UVBetweenSevenAndEleven();
            }
            else if (UVResponse.value <= 7 && UVResponse.value > 5) {
                UVBetweenFiveAndSeven();
            }
            else if (UVResponse.value <= 5 && UVResponse.value > 2) {
                UVBetweenTwoAndFive();
            }
            else if (UVResponse.value <= 2) {
                UVBelowTwo();
            }
            else if (UVResponse.value >= 11) {
                UVAboveEleven();
            }

            //displays UV Index pulled from uvi api object for city searched
            $(".UVIndex").text("UV Index: " + UVResponse.value);
        })

    });

    $.ajax({
        url: queryForecastURL,
        method: "GET"
    }).then(function (secondResponse) {
 
        //populating the date, icon, temperature, and humidity for day 1 of forecast
        $(".dateOne").text(secondResponse.list[3].dt_txt);
        var iconCodeOne = secondResponse.list[3].weather[0].icon;
        var iconURLOne = ("http://openweathermap.org/img/wn/" + iconCodeOne + ".png");
        $(".iconOne").html("<img src=" + iconURLOne + ">");
        var tempFOne = (secondResponse.list[3].main.temp - 273.15) * 1.80 + 32;
        $(".dayOne").text("Temp: " + tempFOne.toFixed(1) + "°F");
        $(".dayOneH").text("Humidity: " + secondResponse.list[0].main.humidity + "%");

        //populating the date, icon, temperature, and humidity for day 2 of forecast
        $(".dateTwo").text(secondResponse.list[11].dt_txt);
        var iconCodeTwo = secondResponse.list[11].weather[0].icon;
        var iconURLTwo = ("http://openweathermap.org/img/wn/" + iconCodeTwo + ".png");
        $(".iconTwo").html("<img src=" + iconURLTwo + ">");
        var tempFTwo = (secondResponse.list[1].main.temp - 273.15) * 1.80 + 32;
        $(".dayTwo").text("Temp: " + tempFTwo.toFixed(1) + "°F");
        $(".dayTwoH").text("Humidity: " + secondResponse.list[1].main.humidity + "%");

        //populating the date, icon, temperature, and humidity for day 3 of forecast
        $(".dateThree").text(secondResponse.list[19].dt_txt);
        var iconCodeThree = secondResponse.list[19].weather[0].icon;
        var iconURLThree = ("http://openweathermap.org/img/wn/" + iconCodeThree + ".png");
        $(".iconThree").html("<img src=" + iconURLThree + ">");
        var tempFThree = (secondResponse.list[2].main.temp - 273.15) * 1.80 + 32;
        $(".dayThree").text("Temp: " + tempFThree.toFixed(1) + "°F");
        $(".dayThreeH").text("Humidity: " + secondResponse.list[2].main.humidity + "%");

        //populating the date, icon, temperature, and humidity for day 4 of forecast
        $(".dateFour").text(secondResponse.list[27].dt_txt);
        var iconCodeFour = secondResponse.list[27].weather[0].icon;
        var iconURLFour = ("http://openweathermap.org/img/wn/" + iconCodeFour + ".png");
        $(".iconFour").html("<img src=" + iconURLFour + ">");
        var tempFFour = (secondResponse.list[3].main.temp - 273.15) * 1.80 + 32;
        $(".dayFour").text("Temp: " + tempFFour.toFixed(1) + "°F");
        $(".dayFourH").text("Humidity: " + secondResponse.list[3].main.humidity + "%");

        //populating the date, icon, temperature, and humidity for day 5 of forecast
        $(".dateFive").text(secondResponse.list[35].dt_txt);
        var iconCodeFive = secondResponse.list[35].weather[0].icon;
        var iconURLFive = ("http://openweathermap.org/img/wn/" + iconCodeFive + ".png");
        $(".iconFive").html("<img src=" + iconURLFive + ">");
        var tempFFive = (secondResponse.list[4].main.temp - 273.15) * 1.80 + 32;
        $(".dayFive").text("Temp: " + tempFFive.toFixed(1) + "°F");
        $(".dayFiveH").text("Humidity: " + secondResponse.list[4].main.humidity + "%");
    })
}
//functions to set the color of the UV Index background based on value of UV Index returned
function UVBetweenSevenAndEleven() {
    var el = document.getElementById("UV");
    el.style.backgroundColor = "red";
    el.style.display = "inline-flex";
}

function UVBetweenFiveAndSeven() {
    var el = document.getElementById("UV");
    el.style.backgroundColor = "orange";
    el.style.display = "inline-flex";
}

function UVBetweenTwoAndFive() {
    var el = document.getElementById("UV");
    el.style.backgroundColor = "yellow";
    el.style.display = "inline-flex";
}

function UVBelowTwo() {
    var el = document.getElementById("UV");
    el.style.backgroundColor = "green";
    el.style.display = "inline-flex";
}

function UVAboveEleven() {
    var el = document.getElementById("UV");
    el.style.backgroundColor = "light purple";
    el.style.display = "inline-flex";
}

//create button with name of previous cities searched that 
//when pushed will render the weather info for the city
var searchedCities = [];

function renderButtons(searchedCities) {
    $("#citiesSearched").empty();

    for (var i = 0; i < searchedCities.length; i++) {
        var a = $("<button>");
        // a.attr("type", "button");
        a.addClass("previousCity");
        a.attr("data-name", searchedCities[i]);
        a.text(searchedCities[i]);
        $("#citiesSearched").append(a);
    }
}
$(".previousCity").on("click", function(event) {
    event.preventDefault();
    displayWeatherInfo($(this).text());
});

$("#run-search").on("click", searchWeather);