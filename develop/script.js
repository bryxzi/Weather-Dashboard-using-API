

var userInput = document.getElementById('city');
var searchBtn = document.getElementById('submitBtn');
var showContainer = document.getElementById('weather-container');

var baseurl = "https://api.openweathermap.org/data/2.5/forecast?&q={userInput}&appid=9fd29d7cb5af7825d043e54a29f20d1e"

var fiveDayArr = [];
showHistory();

searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    
    fetchData(userInput.value);
    userInput.value = '';
});

async function fetchData(userInput) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?&q=${userInput}&units=metric&appid=9fd29d7cb5af7825d043e54a29f20d1e`;


    try {
        const response = await fetch(url);
        console.log(response)
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            var cityName = data.city.name;
            var currentDate = data.list[0].dt_txt;
            var humidity = data.list[0].main.humidity;
            var temp = (data.list[0].main.temp);
            var icon = data.list[0].weather[0].icon;
    
            var wind = (data.list[0].wind.speed);


            makeCurrentWeatherBox(cityName, temp, humidity, wind, icon);
            fiveDayArr = []
            for (let i = 4; i < data.list.length; i += 8) {
                fiveDayArr.push({
                    temp: data.list[i].main.temp,
                    humidity: data.list[i].main.humidity,
                    wind: data.list[i].wind.speed,
                    icon: data.list[i].weather[0].icon
        
                });
            }
            makeFiveDayCards(data);
            saveSearch(userInput);
            showHistory();
        } else {
            console.log(response.status, response.statusText);
            console.log(userInput);
        }

    } catch (error) {
        console.log(error);
    }
}

function saveSearch(city) {
    var searches = localStorage.getItem('searches') || "[]";
    searches = JSON.parse(searches);

    var cityLowercase = city.toLowerCase();

    var cityExists = searches.some(function (search) {
        return search.toLowerCase() === cityLowercase;
    });

    if (!cityExists) {
        var cityFormatted = cityLowercase.charAt(0).toUpperCase() + cityLowercase.slice(1);
        searches.push(cityFormatted);


    localStorage.setItem('searches', JSON.stringify(searches));
}
}

function showHistory() {
    var searchHistory = localStorage.getItem('searches');
    const history = document.querySelector('#search-history');
    history.innerHTML = '';
    var ul = document.createElement('ul');
    ul.setAttribute('id', 'city-list');

    searchHistory = JSON.parse(searchHistory);

    for (let key in searchHistory) {
        console.log(searchHistory[key]);
        var li = document.createElement('li');
        li.textContent = searchHistory[key];
        ul.appendChild(li);
        history.appendChild(ul);
        li.addEventListener('click', searchAgain);

    }
    var clearButton = document.createElement('button');
    clearButton.setAttribute('id', 'clear');
    clearButton.textContent = 'Clear History';
    history.appendChild(clearButton);
    clearButton.addEventListener('click', clearHistory)
}

function searchAgain(event) {
    var clickedCity = event.target.textContent;
    console.log
    console.log(clickedCity);
    fetchData(clickedCity);
    
}

function clearHistory() {
    localStorage.clear();
    showHistory();
}

function makeCurrentWeatherBox(cityName, temperature, humidity, windSpeed, icon) {
    const cityEl = document.querySelector('#searched');
    const tempEl = document.querySelector('#temp');
    const windEl = document.querySelector('#wind');
    const humidityEl = document.querySelector('#humidity');
    const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`
    const iconEl = document.querySelector('#icon');
    var mainCardEl = document.querySelector('#main-card');
    showContainer.style.display = 'block';
    if (mainCardEl.hasChildNodes()) {
        mainCardEl.classList.add('has-border');
    }



    var today = new Date().toLocaleDateString();

    cityEl.innerHTML = cityName + ' (' + today + ')';
    iconEl.setAttribute('src', iconUrl);
    tempEl.innerHTML = 'Temp: ' + temperature + '°C';
    windEl.innerHTML = 'Wind: ' + windSpeed + ' MPH';
    humidityEl.innerHTML = 'Humidity: ' + humidity + '%';
}

function makeFiveDayCards(data) {

    console.log("Making 5 day cards")
    console.log(fiveDayArr)
    const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`
    const iconEl = document.querySelector('#icon');
    // document.querySelector('#edit-later').style.display = 'block';

    const fiveDay = document.querySelector('#forecast');
    fiveDay.innerHTML = '';
    

    for (let i = 0; i < fiveDayArr.length; i++) {
        const dayWeatherDiv = document.createElement('div');
        dayWeatherDiv.setAttribute('id', 'card-boxes');


        const date = document.createElement('p');
        date.innerText = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString();

        const icon = document.createElement('img')
        icon.setAttribute('src', `http://openweathermap.org/img/wn/${fiveDayArr[i].icon}.png`)
        
        const temperature = document.createElement('p');
        temperature.innerText = `Temp: ${fiveDayArr[i].temp} °C`;

        const windSpeed = document.createElement('p');
        windSpeed.innerText = `Wind: ${fiveDayArr[i].wind} km/h`;

        const humidity = document.createElement('p');
        humidity.innerText = `Humidity: ${fiveDayArr[i].humidity} %`;


        dayWeatherDiv.append(date,icon, temperature, humidity, windSpeed);
        fiveDay.appendChild(dayWeatherDiv);
    }
}

