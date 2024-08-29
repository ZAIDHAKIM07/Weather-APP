/******************************************************************************
***
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: _MOHAMMED ZAID SHABBIR KHAN HAKIM_ Student ID: _173018219___ Date: ______5/28/2024______________
*
*
******************************************************************************
**/




const apiKey = 'e3c12d1f4acf1510f33c3141af78f280';

document.addEventListener('DOMContentLoaded', () => {
    // Fetch current location weather on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        });
    }

    document.getElementById('search-button').addEventListener('click', fetchWeatherByCity);
    document.getElementById('city-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            fetchWeatherByCity();
        }
    });
});

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data, 'location-weather'))
        .catch(error => console.error('Error fetching weather by coordinates:', error));
}

function fetchWeatherByCity() {
    const cityInput = document.getElementById('city-input').value.trim();
    const url = `https://api.openweathermap.org/data/2.5/find?q=${cityInput}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.count > 0) {
                displayWeatherList(data.list);
            } else {
                displayError('City not found. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching weather by city:', error));
}

function displayWeather(data, elementId) {
    const weatherDiv = document.getElementById(elementId);
    weatherDiv.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png"> ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Max/Min: ${data.main.temp_max}°C / ${data.main.temp_min}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
        <p><img src="http://openweathermap.org/images/flags/${data.sys.country.toLowerCase()}.png" alt="${data.sys.country} flag"></p>
    `;
}

function displayWeatherList(list) {
    const resultsDiv = document.getElementById('weather-results');
    resultsDiv.innerHTML = '';
    list.forEach(item => {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('col-md-4', 'weather-card');
        weatherCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${item.name}, ${item.sys.country}</h5>
                    <p class="card-text"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png"> ${item.weather[0].description}</p>
                    <p class="card-text">Temperature: ${item.main.temp}°C</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(weatherCard);
    });
}

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
}

let currentPage = 1;
let weatherList = [];

function fetchWeatherByCity() {
    const cityInput = document.getElementById('city-input').value.trim();
    const url = `https://api.openweathermap.org/data/2.5/find?q=${cityInput}&appid=${apiKey}&units=metric&cnt=50`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.count > 0) {
                weatherList = data.list;
                currentPage = 1;
                displayPaginatedWeather();
            } else {
                displayError('City not found. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching weather by city:', error));
}

function displayPaginatedWeather() {
    const resultsDiv = document.getElementById('weather-results');
    resultsDiv.innerHTML = '';
    const start = (currentPage - 1) * 3;
    const end = start + 3;
    const paginatedList = weatherList.slice(start, end);

    paginatedList.forEach(item => {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('col-md-4', 'weather-card');
        weatherCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${item.name}, ${item.sys.country}</h5>
                    <p class="card-text"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png"> ${item.weather[0].description}</p>
                    <p class="card-text">Temperature: ${item.main.temp}°C</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(weatherCard);
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    prevPageButton.parentElement.classList.toggle('disabled', currentPage === 1);
    nextPageButton.parentElement.classList.toggle('disabled', currentPage * 3 >= weatherList.length);
}

document.getElementById('prev-page').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        displayPaginatedWeather();
    }
});

document.getElementById('next-page').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage * 3 < weatherList.length) {
        currentPage++;
        displayPaginatedWeather();
    }
});
// Function to display results for a specific page
function displayResults(pageNumber) {
    const startIndex = (pageNumber - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);
    // Display paginated results on the page
}

// Function to fetch coordinates for a given city
async function fetchCoordinates(city) {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const coordinates = {
            lat: data.coord.lat,
            lon: data.coord.lon
        };
        return coordinates;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}
