// Define Variables 
var apiKey = "fce6bd9d569c80c55e49fc3d9cabf2fe"
var baseUrl = "http://api.openweathermap.org"
var today = moment().format('L');

var searchInput = document.querySelector("#search-input");
var searchForm = document.querySelector("#search-form");
// var listCity = document.querySelector (".list-group-item");
var cityName = document.querySelector("#city-name");
var cityTemp = document.querySelector("#city-temp");
var cityWind = document.querySelector("#city-wind");
var cityHumid = document.querySelector("#city-humidity");
var cityUv = document.querySelector("#city-uv-index");

var recentCitySearchArr = []; 

function fetchCoords(search) {
    var apiUrl = `${baseUrl}/data/2.5/weather?q=${search}&appid=${apiKey}` 

    fetch (apiUrl)
    .then((response) => response.json())
    .then((data) => { console.log(data) 
        fetchWeather(data.coord)
        
        var cityName = $(`
            <h2 id="city-name"> ${data.name} ${today} </h2> 
        `)

        $("#city-name").append(cityName);
    });
}
function fetchWeather(coord) {
    var {lat} = coord 
    var {lon} = coord  
    var city = coord.name 
    var apiUrl = `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    
    fetch (apiUrl)
    .then((response) => response.json())
    .then((data) => { console.log(data) 

        // Display current city weather conditions 
        cityTemp.innerHTML = `Temp: ${data.current.temp} °F`;
        cityWind.innerHTML = `Wind: ${data.current.wind_speed} MPH`;
        cityHumid.innerHTML = `Humidity: ${data.current.humidity} %`;

        // Display current city uvi 
        var uvIndex = data.current.uvi;
        var uvIndexInfo = $(`
            <p> UV Index: 
                <span id="uvIndexColor" class="px-2 py-2 rounded"> ${uvIndex} </span>
            </p> 
        `);

        $("#city-weather").append(uvIndexInfo)
        
        // Uvi index: 0-5 low risk green#72f05d, 6-7 moderate orange#e09936, 8-10 high risk red#eb2902, 11+ very high risk purple#8a2173
        if (uvIndex >= 0 && uvIndex <= 5) {
            $("#uvIndexColor").css("background-color", "#72f05d").css("color", "white");
        } else if (uvIndex >= 6 && uvIndex <= 7) {
            $("#uvIndexColor").css("background-color", "#e09936");
        } else if (uvIndex >= 8 && uvIndex <= 10) {
            $("#uvIndexColor").css("background-color", "#eb2902").css("color", "white");
        } else {
            $("#uvIndexColor").css("background-color", "#8a2173").css("color", "white"); 
        }; 

        var futureCardTitle = $(`
        <h3> Five Day Forecast: </h3>
        `);

        $("#forecast-title").append(futureCardTitle)


        // Display five day forecast 
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: data.daily[i].dt,
                icon: data.daily[i].weather[0].icon,
                temp: data.daily[i].temp.day,
                wind: data.daily[i].wind_speed,
                humidity: data.daily[i].humidity
            };
            
            var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png"`
    

            var futureCard = $(`
            <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-light text-dark">
                    <div class="card-body"> 
                        <h5> ${currentDate}</h5> 
                        <p> ${iconURL} </p>
                        <p> Temp: ${cityInfo.temp} °F</p>
                        <p> Wind: ${cityInfo.wind} MPH </p>
                        <p> Humidity: ${cityInfo.humidity}\%</p>
                    </div> 
                </div>
            </div> 
            `);
    
        $("#five-day-forecast").append(futureCard);
        }
    });
}
function handleSearchForm(e) {
    e.preventDefault()
    var cityName = searchInput.value.trim()
    fetchCoords(cityName) ;

    if(!recentCitySearchArr.includes(cityName)) {
        recentCitySearchArr.push(cityName);
        var searchedCity = $(`
            <li class="list-group-item">${cityName}</li>
        `);
        $("#search-history").append(searchedCity);
    };

    localStorage.setItem("city", JSON.stringify(recentCitySearchArr));
    console.log(recentCitySearchArr);
};

searchForm.addEventListener("submit", handleSearchForm)


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    fetchWeather(listCity);
});

