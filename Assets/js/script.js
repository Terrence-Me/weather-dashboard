let inputval = document.getElementById("input");
let searchBtn = document.getElementById("search");
let cityDateCur = document.getElementById("city-date");
let tempCur = document.getElementById("temp");
let windCur = document.getElementById("wind");
let humidCur = document.getElementById("humidity");
let uvCur = document.getElementById("uv");
let iconCur = document.getElementById("icon");
let fiveDayEl = document.querySelector(".fiveDay");
let liSearch = document.querySelector(".li-search");
let history = document.querySelector(".past-search");
// let uvIndex;
// console.log(uvIndex);

// function init() {
//   inputval = "";
// }

let searchArea = [];

function init() {
  let storedInfo = JSON.parse(localStorage.getItem("search"));

  if (storedInfo !== null) {
    searchArea = storedInfo;
  }

  inputval.innerHTML = "";
}

function getApi(searchInput) {
  inputval.innerHTML = "";
  console.log(input);
  let requestUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    searchInput +
    "&appid=3726c2e5b5b4c36a97f6c6f8f891b10a&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let curWeather = document.querySelector(".current-data");
      let date = new Date(data.dt * 1000);
      curWeather.innerHTML = `<h3 class="city" id="city-date">${
        data.name
      },<span> ${date.toDateString()}</span> <img src="http://openweathermap.org/img/wn/${
        data.weather[0].icon
      }.png" alt="${data.weather[0].description}" /></h3>
      <ul class="current">
          <li class="current-weather-li">Temp: ${data.main.temp} &deg;F</li>
          <li class="current-weather-li">Wind: ${data.wind.speed} MPH</li>
          <li class="current-weather-li">Humidity: ${data.main.humidity} %</li>
          <li class="current-weather-li">UV Index:<span id="uv" class="curSpan"></span></li>
      </ul>`;

      //   cityDateCur.textContent = data.name;
      //   iconCur.textContent = data.clouds.all;
      //   tempCur.textContent = data.main.temp;
      //   windCur.textContent = data.wind.speed;
      //   humidCur.textContent = data.main.humidity;
      //   console.log(cityDateCur);
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      console.log(lat);
      console.log(lon);
      coordinates(lat, lon);
    });
}

function storedSearch() {
  localStorage.setItem("search", JSON.stringify(searchArea));

  for (let i = 0; i < searchArea.length; i++) {
    if (searchArea[i] === searchArea[i - 1]) searchArea.splice(i, 1);
  }
}

function renderPastSearches() {
  for (let i = 0; i < searchArea.length; i++) {
    let area = searchArea[i];

    let li = document.createElement("li");
    li.textContent = area;
    li.setAttribute("class", "past-search", i);
    liSearch.appendChild(li);
  }
}

function coordinates(lat, lon) {
  let fiveDay =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=3726c2e5b5b4c36a97f6c6f8f891b10a&units=imperial";

  fetch(fiveDay)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let forcast = document.querySelector(".forcast2");
      //   uvIndex = data.current.uvi;
      forcast.innerHTML = data.daily
        .map((day, index) => {
          if (index <= 4) {
            let dt = new Date(day.dt * 1000); //timestamp * 1000
            return `<div class="col forcast1">
            <div class= "card mx-1 fiveDay">
            <h5 class="card-title">${dt.toDateString()}</h5>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }.png" class="card-img-top"
                alt="${day.weather[0].description}" />
            <div class="card-body">
                <p class="card-text">Max-Temp: ${day.temp.max}&deg;F</p>
                <p class="card-text">Low-Temp: ${day.temp.min}&deg;F</p>
                <p class="card-text">Wind: ${day.wind_speed} MPH</p>
                <p class="card-text">Humidity: ${day.humidity} %</p>
                </div>
            </div>
            </div>`;
          }
        })
        .join(" ");
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = inputval.value.trim();

  if (!searchInput) {
    console.error("Input Search Location");
    return;
  }

  searchArea.push(searchInput);

  getApi(searchInput);
  renderPastSearches();
  storedSearch();
  //   init();
}

function handleHistorySearch(event) {
  let target = event.target;

  if (event.target.tagName == "UL") {
    target = event.target.childElement;
  }
  newTarget = target.textContent;
  getApi(newTarget);
  //   alert(target.textContent);
  //   alert(event.target + event.currentTarget);
}

searchBtn.addEventListener("click", handleSearchSubmit);
liSearch.addEventListener("click", handleHistorySearch);
init();

// getApi();

// "http://api.openweathermap.org/data/2.5/weather?q=raleigh&appid=3726c2e5b5b4c36a97f6c6f8f891b10a&units=imperial"
