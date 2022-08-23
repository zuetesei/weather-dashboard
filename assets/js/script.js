// Define Variables 
var apiKey = "fce6bd9d569c80c55e49fc3d9cabf2fe"
var baseUrl = "http://api.openweathermap.org"
var today = moment().format('L');

var searchInput = document.querySelector("#search-input");
var searchForm = document.querySelector("#search-form");
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

function handleSearchForm(e) {
    e.preventDefault()
    var cityName = searchInput.value.trim()
    fetchCoords(cityName) 
}

function fetchWeather(coord) {
    var {lat} = coord 
    var {lon} = coord  
    var city = coord.name 
    var apiUrl = `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    
    fetch (apiUrl)
    .then((response) => response.json())
    .then((data) => { console.log(data) 

        // current city weather conditions 
        cityTemp.innerHTML = `Temp: ${data.current.temp} °F`;
        cityWind.innerHTML = `Wind: ${data.current.wind_speed} MPH`;
        cityHumid.innerHTML = `Humidity: ${data.current.humidity} %`;
        // cityUv.innerHTML = `UV Index: ${data.current.uvi}`;

        // uvi index 
        var uvIndex = data.current.uvi;
        var uvIndexInfo = $(`
            <p> UV Index: 
                <span id="uvIndexColor" class="px-2 py-2 rounded"> ${uvIndex} </span>
            </p> 
        `);

        $("#city-weather").append(uvIndexInfo)

        if (uvIndex >= 0 && uvIndex <= 2) {
            $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
        } else if (uvIndex >= 3 && uvIndex <= 5) {
            $("#uvIndexColor").css("background-color", "#FFF300");
        } else if (uvIndex >= 6 && uvIndex <= 7) {
            $("#uvIndexColor").css("background-color", "#F18B00");
        } else if (uvIndex >= 8 && uvIndex <= 10) {
            $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
        } else {
            $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white"); 
        }; 

        // render five day forecast 
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: data.daily[i].dt,
                icon: data.daily[i].weather[0].icon,
                temp: data.daily[i].temp.day,
                humidity: data.daily[i].humidity
            };
            
            var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png"`
    
            var futureCard = $(`
            <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-primary text-light">
                    <div class="card-body"> 
                        <h5> ${currentDate}</h5> 
                        <p> ${iconURL} </p>
                        <p> Temp: ${cityInfo.temp} °F</p>
                        <p> Humidity: ${cityInfo.humidity}\%</p>
                    </div> 
                </div>
            </div> 
        `);
    
        $("#five-day-forecast").append(futureCard);
        }
    });
}

function displaySearchHistory() {
    // pulls localStorage results 

    // pass in data 
}

searchForm.addEventListener("submit", handleSearchForm)

