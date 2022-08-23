// Define Variables 
var apiKey = "fce6bd9d569c80c55e49fc3d9cabf2fe"
var baseUrl = "http://api.openweathermap.org"

var searchInput = document.querySelector("#search-input");
var searchForm = document.querySelector("#search-form");
var displayWeatherEl = document.querySelector("#city-weather");
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
        cityName.textContent = data.name;
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
        cityUv.innerHTML = `UV Index: ${data.current.uvi}`;

        // render five day forecast 
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: data.daily[i].dt,
                icon: data.daily[i].weather[0].icon,
                temp: data.daily[i].temp.day,
                humidity: data.daily[i].humidity
            };
            
            var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
    
            var futureCard = $(`
            <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-primary text-light">
                    <div class="card-body"> 
                        <h5> ${currentDate}</h5> 
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

