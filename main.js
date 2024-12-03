const API_KEY = 'ab4599317c716661f0d19f450d91f994'

function displayWeather(data) {
  document.getElementById('weather-info').innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="weather-details">
            <p>Temperature: ${Math.round(data.main.temp)}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `
}

let weather = document.getElementById('weather-form')
