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
const favoriteCities = ['Lviv', 'Kyiv', 'London', 'Paris', 'Tokyo', 'Cairo', 'Anchorage'];

// Шкала термометра
const thermometerScale = document.querySelector('.thermo-tube-main');

// Функція прогнозу погоди бере дані
async function loadWeather(city) {
    const server = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=953b0f3cb1099077afe9a2b277e47716`;
    const response = await fetch(server, {
        method: 'GET',
    });
    const responseResult = await response.json();

    if (response.ok) {
        getWeather(responseResult);
        getForecast(responseResult);
        changeBackground(responseResult);
    } else {
        showErrorMessage(responseResult.message);
    }
};

// Отримання назви міста з форми
let form = document.querySelector(".select-city");
let cityName = form.elements.city_name;
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let newCity = cityName.value;
    loadWeather(newCity);
    activeFavoriteCity(newCity);
    cityName.value = "";
});

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

    showThermometerScale(temp);

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
function getForecast(weather) {
    weatherBlockDays.classList.remove('hide');
    weatherBlockDays.innerHTML = "";

    let forecast = weather.list;
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    forecast.forEach(el => {
        const weatherDay = document.createElement("div");
        weatherDay.classList.add("weather-day");

        let time = new Date(el.dt_txt);
        let digitalTime = time.getTime();
        let timezone = weather.city.timezone;
        let mathLocalTime = digitalTime - 7200000 + timezone * 1000;    // 7200s is local timezone of Ukraine
        let localTime = new Date(mathLocalTime);
        let numberOfDay = localTime.getDay(time);
        let day = daysOfWeek[numberOfDay];
        let hours = localTime.getHours();
        let minutes = localTime.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;

        let weatherIcon = el.weather[0].icon;
        let weatherStatus = el.weather[0].description;
        let temperature = Math.round(el.main.temp);
        let humidity = Math.round(el.main.humidity);
        
        weatherDay.innerHTML = `
            <div class="day-time" title="${localTime.toLocaleDateString()}"><p class="day-name">${day}</p><p class="day-hours"> ${hours}:${minutes}</p></div>
            <div class="day-icon">
                <img class="day-img" src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" title="${weatherStatus}" alt="${weatherStatus}">
            </div>
            <div class="day-temp" title="Temperature">${temperature}&deg;</div>
            <div class="day-hum" title="Humidity"><i class="fa-solid fa-droplet"></i> ${humidity}&#37;</div>
        `
        weatherBlockDays.appendChild(weatherDay);

        if (hours >= 0 && hours < 3) {
            weatherDay.classList.add('first-time-of-day')
        } if (hours >= 21) {
            weatherDay.classList.add('last-time-of-day')
        }
    });
};

// Виведення помилки
function showErrorMessage(message) {
    weatherBlock.classList.add('hide');
    weatherBlockDays.classList.add('hide');
    errorMessageEl.classList.remove('hide');

    message = message[0].toUpperCase() + message.slice(1);

    errorMessageEl.innerText = message;
};

// Відображення температури на термометрі
function showThermometerScale(number) {
    const height = 3 * (50 + number);
    thermometerScale.setAttribute("style", `height: ${height}px`);
}

// Зміна фону сторінки залежно від поточного часу
function changeBackground(data) {
    const thisTime = data.list[0].dt_txt;
    const time = new Date(thisTime);
    const digitalTime = time.getTime();
    const timezone = data.city.timezone;
    const mathLocalTime = digitalTime - 7200000 + timezone * 1000;    // 7200s is local timezone of Ukraine
    const localTime = new Date(mathLocalTime);
    const hours = localTime.getHours();

    const mainBackground = document.querySelector('.main-background');
    const title = document.querySelector('.title-text');

    if (hours >= 6 && hours < 18) {
        mainBackground.classList.add('day-theme');
        mainBackground.classList.remove('night-theme');
        title.style.color = '#000e18';
    } else {
        mainBackground.classList.add('night-theme');
        mainBackground.classList.remove('day-theme');
        title.style.color = '#d8d9da';
    }

    mainBackground.style.backgroundAttachment = 'fixed';
}

loadWeather(mainCity);

getCurrentCity();
activeFavoriteCity(mainCity);