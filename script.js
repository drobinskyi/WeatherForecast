"use strict"

// Блок з погодою зараз
const weatherBlock = document.querySelector('.weather-now');

// Блок зі щоденною погодою
const weatherBlockDays = document.querySelector('.weather-days');

// Блок з улюбленими містами
const favoriteCitiesString = document.querySelector('.favorite-cities');

// Повідомлення про помилку
const errorMessageEl = document.querySelector('.error-message');

// Головне місто
const mainCity = 'Lviv';

// Улюблені міста
const favoriteCities = ['Lviv', 'Kyiv', 'Vinnytsia', 'London', 'Paris', 'Tokyo', 'Anchorage'];

// Функція прогнозу погоди бере дані
async function loadWeather(city) {
    const server = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=953b0f3cb1099077afe9a2b277e47716`;
    const response = await fetch(server, {
        method: 'GET',
    });
    const responseResult = await response.json();

    if (response.ok) {
        getWeather(responseResult);
        getForecast(responseResult.list);
    } else {
        showErrorMessage(responseResult.message);
    }
};

// Отримання назви міста з форми
let form = document.querySelector(".select-city");
let cityName = form.elements.city_name;
function thisCity(event) {
    event.preventDefault();

    let newCity = cityName.value;
    loadWeather(newCity);
    activeFavoriteCity(newCity);
    cityName.value = "";
};

// Вибір улюбленого міста
function getCurrentCity() {
    favoriteCities.forEach((el) => {
        let button = document.createElement("div");
        button.classList.add("favorite-city");
        button.textContent = el;
        button.addEventListener("click", function (content) {
            content = button.textContent;
            loadWeather(el);
            activeFavoriteCity(el);
        });
        favoriteCitiesString.appendChild(button);
    });
};

// Виділення кнопки з вибраним улюбленим містом
function activeFavoriteCity(city) {
    let buttons = document.getElementsByClassName("favorite-city");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === city) {
            buttons[i].classList.add("selected-city");
        } else {
            buttons[i].classList.remove("selected-city");
        };
    };
};

// Відображення поточної погоди
function getWeather(data) {
    weatherBlock.classList.remove('hide');
    errorMessageEl.classList.add('hide');

    const location = data.city.name;
    const temp = Math.round(data.list[0].main.temp);
    const feelsLike = Math.round(data.list[0].main.feels_like);
    const humid = Math.round(data.list[0].main.humidity);
    const weatherIcon = data.list[0].weather[0].icon;
    const weatherStatus = data.list[0].weather[0].main;

    weatherBlock.innerHTML = `
        <div class="weather-city">${location}</div>
        <div class="weather-now-icon">
            <img class="weather-img" src="http://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="${weatherStatus}">
        </div>
        <div class="weather-now-temp">${temp}&deg;</div>
        <div class="weather-now-details">
            <div class="weather-now-box">
                <p class="box-text">Feels like</p>
                <p class="box-details">${feelsLike}&deg;</p>
            </div>
            <div class="weather-now-box">
                <p class="box-text">Humidity</p>
                <p class="box-details">${humid}&#37;</p>
            </div>
        </div>
        `;
};

// Відображення прогнозу погоди
function getForecast(forecast) {
    weatherBlockDays.classList.remove('hide');
    weatherBlockDays.innerHTML = "";

    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    forecast.forEach(el => {
        const weatherDay = document.createElement("div");
        weatherDay.classList.add("weather-day");

        let time = new Date(el.dt_txt);
        let weatherIcon = el.weather[0].icon;
        let weatherStatus = el.weather[0].main;
        let temperature = Math.round(el.main.temp);
        let humidity = Math.round(el.main.humidity);
        let numberOfDay = time.getDay(time);
        let day = daysOfWeek[numberOfDay];
        let hours = time.getHours();
        let minutes = time.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;

        weatherDay.innerHTML = `
            <div class="day-time"><p class="day-name">${day}</p><p class="day-hours"> ${hours}:${minutes}</p></div>
            <div class="day-icon">
                <img class="day-img" src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherStatus}">
            </div>
            <div class="day-temp">${temperature}&deg;</div>
            <div class="day-hum"><i class="fa-solid fa-droplet"></i> ${humidity}&#37;</div>
        `
        weatherBlockDays.appendChild(weatherDay);
    });
};

// Виведення помилки
function showErrorMessage(message) {
    weatherBlock.classList.add('hide');
    weatherBlockDays.classList.add('hide');
    errorMessageEl.classList.remove('hide');

    message = message[0].toUpperCase() + message.slice(1);

    errorMessageEl.innerText = message;
}


if (weatherBlock) {
    loadWeather(mainCity);
};

getCurrentCity();
activeFavoriteCity(mainCity);