// Documentation reference: https://openweathermap.org/current
// Documentation: https://openweathermap.org/api/one-call-api

// API key from OpenWeatherMap
const API_KEY = 'ab4599317c716661f0d19f450d91f994'
// Set up the unit
let units = 'metric'
// Get user's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        ),
      (error) => console.error(error)
    )
  }
}
// Toggle temperature units
function toggleUnits() {
  units = units === 'metric' ? 'imperial' : 'metric'
  const city = document.getElementById('city').value
  if (city) fetchWeather(city)
}
// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
  try {
    const current = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    )
    const forecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    )

    const currentData = await current.json()
    const forecastData = await forecast.json()

    displayWeather(currentData)
    displayForecast(forecastData)
  } catch (error) {
    showError(error.message)
  }
}
// Fetch weather by city name
async function fetchWeather(city) {
  try {
    const current = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
    )
    const forecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`
    )

    const currentData = await current.json()
    const forecastData = await forecast.json()

    if (current.ok && forecast.ok) {
      displayWeather(currentData)
      displayForecast(forecastData)
    } else {
      throw new Error('City not found')
    }
  } catch (error) {
    showError(error.message)
  }
}
// Display current weather
function displayWeather(data) {
  const unitSymbol = units === 'metric' ? '°C' : '°F'
  document.getElementById('weather-info').innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="weather-details">
            <img src="http://openweathermap.org/img/w/${
              data.weather[0].icon
            }.png" alt="weather icon">
            <p>Temperature: ${Math.round(data.main.temp)}${unitSymbol}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} ${
    units === 'metric' ? 'm/s' : 'mph'
  }</p>
        </div>
    `
}

// Display 5-day forecast
function displayForecast(data) {
  const unitSymbol = units === 'metric' ? '°C' : '°F'
  const dailyData = data.list.filter((item) => item.dt_txt.includes('12:00:00'))

  const forecastHTML = dailyData
    .map(
      (day) => `
        <div class="forecast-day">
            <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <img src="http://openweathermap.org/img/w/${
              day.weather[0].icon
            }.png" alt="weather icon">
            <p>${Math.round(day.main.temp)}${unitSymbol}</p>
            <p>${day.weather[0].description}</p>
        </div>
    `
    )
    .join('')

  document.getElementById('forecast').innerHTML = forecastHTML
}

let weather = document.getElementById('weather-form')
// Event listener for form submission
weather.addEventListener('submit', async (e) => {
  // Prevent default form submission
  e.preventDefault()
  const city = document.getElementById('city').value

  try {
    // Fetch weather data from API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
    const data = await response.json()
    // Check if request was successful
    if (response.ok) {
      displayWeather(data)
    } else {
      throw new Error('City not found')
    }
  } catch (error) {
    // Display error message if request fails
    document.getElementById('weather-info').innerHTML = `
            <p class="error">${error.message}</p>
        `
  }
})
