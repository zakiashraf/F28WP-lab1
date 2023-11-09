const cityInput = document.getElementById("cityInput");
const btn = document.getElementById("btn");
const weatherInfo = document.getElementById("weather-info");

btn.addEventListener("click", function () {
  // Step 4: Check for an empty city input
  const city = cityInput.value.trim(); // Trim to remove leading/trailing spaces
  if (city === "") {
    alert("Please enter a city name.");
    return; // Exit the function
  }

  // Step 5: Make an HTTP request to OpenWeatherMap API
  const apiKey = "d8a8fed8af30894a36e77b8e3b580867"; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Step 7: Update the weather info div with weather details
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      const windSpeed = data.wind.speed;

      const htmlString = `<p>The weather in ${city} is ${weatherDescription}</p>
                          <p>The temperature is ${temperature}°C with a wind speed of ${windSpeed} m/s </p>`;

      weatherInfo.innerHTML = htmlString;
    })
    .catch((error) => {
      // Step 6: Handle errors
      console.error("An error occurred:", error);
    });
});
