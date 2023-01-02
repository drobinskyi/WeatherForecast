"use strict"

// Блок з погодою зараз
let weatherBlock = document.querySelector('#weather_now');

// Блок зі щоденною погодою
let weatherBlockDays = document.querySelector('#weather_days');

// Головне місто
let mainCity = 'lviv';

// Отримання назви міста
let form = document.forms[0];
let cityName = form.elements.city_name;
function thisCity(event) {
    event.preventDefault();

    let newCity = cityName.value;
    loadWeather(newCity);

    return false;
}

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
        weatherBlock.innerHTML = responseResult.message;
        weatherBlockDays.innerHTML = responseResult.message;
    }
}

// Відображення поточної погоди
function getWeather(data) {
    const location = data.city.name;
    const temp = Math.round(data.list[0].main.temp);
    const feelsLike = Math.round(data.list[0].main.feels_like);
    const humid = Math.round(data.list[0].main.humidity);
    const weatherIcon = data.list[0].weather[0].icon;
    const weatherStatus = data.list[0].weather[0].main;

    weatherBlock.innerHTML = `
        <div class="weather_city">${location}</div>
        <div class="weather_now_icon">
            <img class="weather_img" src="http://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="${weatherStatus}">
        </div>
        <div class="weather_now_temp">${temp}&deg;</div>
        <div class="weather_now_details">
            <div class="weather_now_box">
                <p class="box_text">Feels like</p>
                <p class="box_details">${feelsLike}&deg;</p>
            </div>
            <div class="weather_now_box">
                <p class="box_text">Humidity</p>
                <p class="box_details">${humid}&#37;</p>
            </div>
        </div>`;
}

// Відображення прогнозу погоди
function getForecast(forecast){
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let i = 0; i < forecast.length; i++) {
        let time = new Date(forecast[i].dt_txt);
        let weatherIcon = forecast[i].weather[0].icon;
        let weatherStatus = forecast[i].weather[0].main;
        let temperature = Math.round(forecast[i].main.temp);
        let humidity = Math.round(forecast[i].main.humidity);
        let numberOfDay = time.getDay(time);
        let day = daysOfWeek[numberOfDay];
        let hours = time.getHours();
        let minutes = time.getMinutes();
        minutes=minutes>9?minutes:'0'+minutes;
        
        weatherBlockDays.innerHTML += `
        <div class="weather_day">
            <div class="day_time"><p class="day_name">${day}</p><p class="day_hours"> ${hours}:${minutes}</p></div>
            <div class="day_icon">
                <img class="day_img" src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherStatus}">
            </div>
            <div class="day_temp">${temperature}&deg;</div>
            <div class="day_hum">${humidity}&#37;</div>
        </div>`;
    }
}

if (weatherBlock) {
    loadWeather(mainCity);
}
