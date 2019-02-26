var weatherAt = ''

function ipLookUp () {
  $.ajax('https://ipinfo.io/json')
  .then(
      function success(response) {
          weatherAt = (`${response.city},${response.region}`);
      },
      function fail(data, status) {
          console.log('IP lookup request failed.  Returned status of', status);
      }
  );
}

function getLocation(){
  locationIn = document.getElementById('newLocation').value;
  if (validLocation(locationIn)) {
    weatherAt = validLocation(locationIn);
  }
  sweatherAPIFetch(weatherAt);
}

function validLocation(txt) {
  if (txt.indexOf(',') > -1) {
    return txt;
  } else {
    return false;
  }
}

function sweatherAPIFetch(loc) {
  var request = new XMLHttpRequest();
  var url = 'https://stormy-depths-85632.herokuapp.com/api/v1/forecast?location='
  request.open('GET', url + loc, true);
  request.onload = function () {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText); makeWeather(data);
    } else {
      alert('BAD INPUT. Enter a REAL U.S. city,state \n- CAPITAL or lowercase OK\n- State may be full or two-letter abbreviation\nEx: Denver, CO');
    }
  }
  request.send();
}

function makeWeather(data_in) {
  enableForecast();
  let data = data_in.data.attributes;
  let cityState = data.city_state;
  let currentTemp = parseInt(data.current_temp);
  let dailySummary = data.daily_summary;
  let dateAndTime = (new Date(data.date_and_time)).toLocaleString();
  let feelsLike = parseInt(data.feels_like);
  let highTemp = parseInt(data.high_temp);
  let hourlySummary = data.hourly_summary;
  let humidity = parseInt(data.humidity * 100);
  let lowTemp = parseInt(data.low_temp);
  let uvIndex = parseInt(data.uv_index);
  let visibility = parseInt(data.visibility);
  let currentGif = data.gif_url;
  makeHourlies(data.hourlies);
  makeDailies(data.dailies);
  document.getElementById("currentLocation").innerHTML = `Current Weather in ${cityState} for `;
  document.getElementById("currentTemp").innerHTML     = `${currentTemp}°`;
  document.getElementById("highLow").innerHTML         = `High/Low: ${highTemp}°/${lowTemp}°`;
  document.getElementById("feelsLike").innerHTML       = `Feels Like: ${feelsLike}°`;
  document.getElementById("humidity").innerHTML        = `Humidity: ${humidity}%  `;
  document.getElementById("uvIndex").innerHTML         = `UV-Index: ${uvIndex}  `;
  document.getElementById("visibility").innerHTML      = `Visibility: ${visibility}mi`;
  document.getElementById("dailySummary").innerHTML    = dailySummary;
  document.getElementById("hourlySummary").innerHTML   = hourlySummary;
  document.getElementById("dateAndTime").innerHTML     = dateAndTime;
  document.getElementById("currentGif").src = currentGif;

  function makeHourlies(array_in) {
    var count = 0;
    array_in.forEach(function(element) {
      count += 1;
      var temp = (parseInt(element.temperature) + '°');
      var timeStamp = new Date(element.hour * 1000);
      document.getElementById("hourlyTemp" + count).innerHTML = temp;
      document.getElementById("hourlyTime" + count).innerHTML = timeStamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    });
  }

  function makeDailies(array_in) {
    var count = 0;
    array_in.forEach(function(element) {
      count += 1;
      var dayStamp = new Date(element.day_of_week * 1000);
      var dayOfWeek = dayStamp.toLocaleDateString();
      var daySummary = element.summary;
      var precipChance = (parseInt(element.chance_of_precipitation * 100)) + '%' + ' ';
      var dayHigh = (parseInt(element.temperature_high)) + '°' + ' ';
      var dayLow = (parseInt(element.temperature_low)) + '°' + ' ';
      document.getElementById("dailyDay" + count).innerHTML = dayOfWeek;
      document.getElementById("dailySummary" + count).innerHTML = daySummary;
      document.getElementById("dailyChance" + count).innerHTML = precipChance;
      document.getElementById("dailyHighLow" + count).innerHTML = dayHigh + ' / ' + dayLow;
    });
  }
}

function aClear(){
  document.getElementById('newLocation').value = weatherAt;
}

function enableForecast() {
  document.querySelector('#forecast').classList.remove("forecast-hide");
  document.querySelector('#forecast').classList.add("forecast-show");
}

function showFavorites() {
  getApiKey().catch((err) => { console.log(err); });
  getFavorites();
}

async function getApiKey() {
  var request = new XMLHttpRequest();
  var email = 'sweather@example.com';
  var password = 'password';
  var url = `https://stormy-depths-85632.herokuapp.com/api/v1/sessions?email=${email}&password=${password}`
  request.open('POST', url, true);
  request.onload = function () {
    if (this.status == 200) {
      let data = JSON.parse(this.responseText);
      sessionStorage.setItem('apiKey', (data.data.attributes.api_key));
    }
  }
  request.send();
}

function getFavorites() {
  var request = new XMLHttpRequest();
  var apiKey = sessionStorage.getItem('apiKey');
  var url = `https://stormy-depths-85632.herokuapp.com/api/v1/favorites?api_key=${apiKey}`;
  request.open('GET', url, true);
  request.onload = function () {
    if (this.status == 200) {
      var parsed = JSON.parse(this.responseText);
      makeFavorites(parsed.data);
    }
  }
  request.send();
}

function makeFavorites(array_in) {
  array_in.forEach(function(element) {
    var favLocation = element.attributes.location;
    var para = document.createElement("P");
    var locText = document.createTextNode(favLocation);
    para.appendChild(locText);
    document.getElementById("favLocation").appendChild(para);
  });
}

ipLookUp();
