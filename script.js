const apiKey = '4ed20316f93eb133de32fa753fbb7510';

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    fetchWeatherDataByCity(city);
});

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoordinates(latitude, longitude);

        }, (error) => {
            alert('Error getting location');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
};

async function fetchWeatherDataByCity(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeatherData(data);
        } else {
            alert('City not found');
        }
    } catch (error) {
        alert('Error fetching data');
    }
}

async function fetchWeatherDataByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        alert('Error fetching data');
    }
}


function displayWeatherData(data) {
    document.getElementById('cityName').innerHTML ='<i class="fa-solid fa-location-dot"></i> '+ data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = `${data.weather[0].description}`;
    document.getElementById('humidity').innerHTML = `<i class="fa-solid fa-droplet"></i> : ${data.main.humidity}%`;
    document.getElementById('wind').innerHTML = `<i class="fa-solid fa-wind"></i>  : ${data.wind.speed} m/s`;
    document.getElementById('weatherData').style.display = 'flex';
    
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours}:${minutes}`;
    document.getElementById('time').innerHTML = time+' <i class="fa-solid fa-clock"></i>';
    const sunsetTime = convertUnixToTime(data.sys.sunset, data.timezone);
    document.getElementById('sunset').innerHTML = `<i class="fa-solid fa-sun"></i> : ${sunsetTime}`;
    showWeatherImage(data.weather[0].main);
}



function showWeatherImage(weatherType, hours) {
    const weatherImage = document.getElementById('weatherImage');
    const isDayTime = hours >= 6 && hours < 18; // Daytime between 6:00 and 18:00

    switch (weatherType) {
        case 'Clear':
            weatherImage.src =isDayTime ? 'images/sunny.gif' : 'images/clear.gif';
            break;
        case 'Clouds':
            weatherImage.src = 'images/clouds.gif' ;
            break;
        case 'Rain':
            weatherImage.src = 'images/rain.gif';
            break;
        case 'Drizzle':
            weatherImage.src = 'images/drizzle.gif';
            break;
        case 'Thunderstorm':
            weatherImage.src = 'images/thunderstorm.gif' ;
            break;
        case 'Snow':
            weatherImage.src = 'images/snow.gif';
            break;
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Ash':
        case 'Squall':
        case 'Tornado':
            weatherImage.src = 'images/mist.gif';
            break;
        default:
            weatherImage.src = 'images/sunny.gif';
            break;
    }
}


function convertUnixToTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}