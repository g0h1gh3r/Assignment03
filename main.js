// Documentation reference: https://openweathermap.org/current
// Documentation: https://openweathermap.org/api/one-call-api

// API key from OpenWeatherMap
const API_KEY = 'ab4599317c716661f0d19f450d91f994'
// Set up the unit
let units = 'metric'
// Function to convert weather code to Font Awesome icon class
function getWeatherIcon(code) {
  const icons = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud-sun',
    '02n': 'cloud-moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'clouds',
    '04n': 'clouds',
    '09d': 'cloud-showers-heavy',
    '09n': 'cloud-showers-heavy',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'bolt',
    '11n': 'bolt',
    '13d': 'snowflake',
    '13n': 'snowflake',
    '50d': 'smog',
    '50n': 'smog',
  }
  return `<i class="fas fa-${icons[code] || 'cloud'} fa-2x"></i>`
}
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
  document.getElementById('weather-info').innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="weather-details">
            ${getWeatherIcon(data.weather[0].icon)}
            <p>Temperature: ${Math.round(data.main.temp)}${
    units === 'metric' ? '°C' : '°F'
  }</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} ${
    units === 'metric' ? 'm/s' : 'mph'
  }</p>
        </div>
    `
}

// Show error message
function showError(message) {
  document.getElementById('weather-info').innerHTML = `
        <p class="error">${message}</p>
    `
  document.getElementById('forecast').innerHTML = ''
}

// Display 5-day forecast

function displayForecast(data) {
  const dailyData = data.list.filter((item) => item.dt_txt.includes('12:00:00'))

  const forecastHTML = dailyData
    .map(
      (day) => `
        <div class="forecast-day">
            <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            ${getWeatherIcon(day.weather[0].icon)}
            <p>${Math.round(day.main.temp)}${
        units === 'metric' ? '°C' : '°F'
      }</p>
            <p>${day.weather[0].description}</p>
        </div>
    `
    )
    .join('')

  document.getElementById('forecast').innerHTML = forecastHTML
}
// Initialize with user's location
getLocation()
// Event listeners
document.getElementById('weather-form').addEventListener('submit', (e) => {
  e.preventDefault()
  fetchWeather(document.getElementById('city').value)
})

document.getElementById('unit-toggle').addEventListener('click', toggleUnits)
document.getElementById('locate-me').addEventListener('click', getLocation)
