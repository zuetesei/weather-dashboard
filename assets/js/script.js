// Define Variables
var apiKey = "fce6bd9d569c80c55e49fc3d9cabf2fe";
var baseUrl = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org";
var today = moment().format("L");

var currentWeatherEl = document.querySelector("#city-weather");
var searchInput = document.querySelector("#search-input");
var searchForm = document.querySelector("#search-form");
var recentCitySearchArr = [];

function fetchCoords(search) {
  var apiUrl = `${baseUrl}/data/2.5/weather?q=${search}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      fetchWeather(data.coord);
    });
}
function fetchWeather(coord) {
  var { lat } = coord;
  var { lon } = coord;
  var city = coord.name;
  var apiUrl = `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Display current city weather conditions
      var cityName = document.createElement("h1");
      cityName.innerHTML = `${searchInput.value}  ${today} `;
      cityName.setAttribute("class", "mb-4");
      cityName.style.textTransform = "uppercase";

      var iconCode = data.current.weather[0].icon;
      var iconCard = $(`
        <img src="https://openweathermap.org/img/w/${iconCode}.png">
      `);

      var cityTemp = document.createElement("p");
      cityTemp.innerHTML = `Temperature:  ${data.current.temp} °F`;

      var cityWind = document.createElement("p");
      cityWind.innerHTML = `Wind Speed:  ${data.current.wind_speed} MPH`;

      var cityHumid = document.createElement("p");
      cityHumid.innerHTML = `Humidity:  ${data.current.humidity} %`;

      var uvIndexP = document.createElement("p");
      var uvIndex = document.createElement("span");
      uvIndex.setAttribute("id", "uvIndexColor");
      uvIndex.setAttribute("class", "px-2 py-2 mt-2 rounded");
      uvIndex.innerHTML = `UV Index: ${data.current.uvi}`;
      $(uvIndexP).append(uvIndex);

      $(currentWeatherEl).append(
        cityName,
        iconCard,
        cityTemp,
        cityWind,
        cityHumid,
        uvIndexP
      );

      // Uvi index: 0-5 low risk green#72f05d, 6-7 moderate orange#e09936, 8-10 high risk red#eb2902, 11+ very high risk purple#8a2173
      if (uvIndex >= 0 && uvIndex <= 5) {
        $("#uvIndexColor")
          .css("background-color", "#72f05d")
          .css("color", "white");
      } else if (uvIndex >= 6 && uvIndex <= 7) {
        $("#uvIndexColor").css("background-color", "#e09936");
      } else if (uvIndex >= 8 && uvIndex <= 10) {
        $("#uvIndexColor")
          .css("background-color", "#eb2902")
          .css("color", "white");
      } else {
        $("#uvIndexColor")
          .css("background-color", "#8a2173")
          .css("color", "white");
      }

      // five day forecast title
      var futureCardTitle = document.createElement("h3");
      futureCardTitle.textContent = "Five Day Forecast:";
      $("#forecast-title").append(futureCardTitle);

      // Display five day forecast
      for (let i = 0; i < 5; i++) {
        var cityInfo = {
          date: data.daily[i].dt,
          icon: data.daily[i].weather[0].icon,
          temp: data.daily[i].temp.day,
          wind: data.daily[i].wind_speed,
          humidity: data.daily[i].humidity,
        };

        var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
        var forecastIconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png"`;

        var futureCard = $(`
            <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-light text-dark">
                    <div class="card-body"> 
                        <h5> ${currentDate}</h5> 
                        <p> ${forecastIconURL} </p>
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
  $("#forecast-title").empty();
  $("#five-day-forecast").empty();
  $("#city-weather").empty();
  e.preventDefault();

  var cityName = searchInput.value.trim();
  fetchCoords(cityName);

  if (!recentCitySearchArr.includes(cityName)) {
    recentCitySearchArr.push(cityName);
    // WHEN I click on a city in the search history
    // THEN I am again presented with current and future conditions for that city
    var searchedCity = $(`
            <li class="list-group-item">${cityName}</li>
        `).click(function (e) {
      $("#forecast-title").empty();
      $("#five-day-forecast").empty();
      $("#city-weather").empty();
      searchInput.value = e.target.textContent;
      fetchCoords(e.target.textContent);
      console.log(e.target.textContent);
    });

    $("#search-history").append(searchedCity);
  }

  localStorage.setItem("city", JSON.stringify(recentCitySearchArr));
}

searchForm.addEventListener("submit", handleSearchForm);


$(document).ready(function () {
  var searchHistory = JSON.parse(localStorage.getItem("city"));
  
  if (recentCitySearchArr !== null) {
    var lastSearchedIndex = searchHistory.length - 1;
    var lastSearchedCity = searchHistory[lastSearchedIndex];
    fetchCoords(lastSearchedCity); 
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const data = localStorage.getItem(key)
}
});
