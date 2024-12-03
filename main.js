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
// Function to display weather data
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
