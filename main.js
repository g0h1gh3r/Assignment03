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

weather.addEventListener('submit', async (e) => {
  e.preventDefault()
  const city = document.getElementById('city').value

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
    const data = await response.json()

    if (response.ok) {
      displayWeather(data)
    } else {
      throw new Error('City not found')
    }
  } catch (error) {
    document.getElementById('weather-info').innerHTML = `
            <p class="error">${error.message}</p>
        `
  }
})
