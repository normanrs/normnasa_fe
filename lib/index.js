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
  array_in.forEach(function(element) {
    count += 1;
    var text = element.attributes.text;
    var url = element.attributes.url;
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

async function signup(){
  var request = new XMLHttpRequest();
  var email = document.getElementById('signupEmail').value;
  var password = document.getElementById('signupPassword').value;
  var url = `https://stark-harbor-19254.herokuapp.com/api/v1/users?email=${email}&password=${password}`
  request.open('POST', url, true);
  request.onload = function () {
    if (this.status == 201) {
      let data = JSON.parse(this.responseText);
      console.log(data);
      sessionStorage.setItem('apiKey', (data.data.attributes.api_key));
      console.log(sessionStorage.getItem('apiKey'));
    }
  }
  request.send();
}

async function getApiKey(email, password) {
  var request = new XMLHttpRequest();
  var url = `https://stark-harbor-19254.herokuapp.com/api/v1/users?email=${email}&password=${password}`
  request.open('GET', url, true);
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

function hideModals() {
  document.getElementById('signupEmail').innerHTML = '';
  document.getElementById('signupPassword').innerHTML = '';
  $('.modal').modal('hide');
}


nasaTop();
