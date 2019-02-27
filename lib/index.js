var searchString = ''

function nasaTop () {
  var request = new XMLHttpRequest();
  var url = 'https://stark-harbor-19254.herokuapp.com/api/v1/nasa'
  request.open('GET', url, true);
  request.onload = function () {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText); showTweets(data);
    } else {
      alert('Houston we have a problem. NASA tweets not available.');
    }
  }
  request.send();
}

function getSearch(){
  searchString = document.getElementById('newSearch').value;
  normnasaFetch(searchString);
}

function normnasaFetch(string) {
  var request = new XMLHttpRequest();
  var url = 'https://stark-harbor-19254.herokuapp.com/api/v1/nasa?search='
  request.open('POST', url + string, true);
  request.onload = function () {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText); showTweets(data);
    } else {
      alert('Houston we have a problem. Nothing found for those search terms');
    }
  }
  request.send();
}

function showTweets(data_in) {
  var array_in = data_in.data;
  var count = 0;
  console.log(array_in);
  array_in.forEach(function(element) {
    count += 1;
    var text = element.attributes.text;
    var url = element.attributes.url;
    console.log(text + ' ' + url + count)
    if (text !==null) {
      document.getElementById("tweetText" + count).innerHTML = text;
    } else {
      document.getElementById("tweetText" + count).innerHTML = 'No tweet';
    }
    if (url !==null) {
      document.getElementById("currentGif" + count).innerHTML = `<embed src="${url}" style="width:1000px; height: 800px;">`;
    } else {
      document.getElementById("currentGif" + count).innerHTML = 'No Image';
    }
  });
}

function aClear(){
  document.getElementById('newSearch').value = searchString;
}

async function getApiKey() {
  var request = new XMLHttpRequest();
  var email = 'sweather@example.com';
  var password = 'password';
  var url = `https://stark-harbor-19254.herokuapp.com/api/v1/sessions?email=${email}&password=${password}`
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
  var url = `https://stark-harbor-19254.herokuapp.com/api/v1/favorites?api_key=${apiKey}`;
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

nasaTop();
