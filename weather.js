// ====== CONFIG ======
const WEATHER_API_KEY = "ff458678d79d27a06b9017d649dc822d"; // <-- replace this
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Map of city labels to API query values (matches your <option> values)
const cityMap = {
    "New York,US": "New York,US",
    "London,GB": "London,GB",
    "Tokyo,JP": "Tokyo,JP",
    "Sydney,AU": "Sydney,AU",
    "Dubai,AE": "Dubai,AE",
    "Paris,FR": "Paris,FR",
    "Toronto,CA": "Toronto,CA",
    "Hong Kong,HK": "Hong Kong,HK"
};

// ====== Fetch + render weather ======
async function fetchWeather(cityKey) {
    const q = cityMap[cityKey] || "New York,US";

    const url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(q)}&appid=${WEATHER_API_KEY}&units=imperial`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Weather fetch failed");
    }
    return response.json();
}

function formatLocalTime(dt, timezoneOffsetSeconds) {
    // dt is in seconds (UTC), timezoneOffsetSeconds is offset from UTC in seconds
    const localTimestamp = (dt + timezoneOffsetSeconds) * 1000;
    const date = new Date(localTimestamp);

    const options = {
        hour: "numeric",
        minute: "2-digit"
    };

    return date.toLocaleTimeString(undefined, options);
}

function renderWeather(data) {
    const container = document.getElementById("weatherDisplay");
    if (!container) return;

    const cityName = data.name;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const condition = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const localTime = formatLocalTime(data.dt, data.timezone);

    const high = Math.round(data.main.temp_max);
    const low = Math.round(data.main.temp_min);

    container.innerHTML = `
        <div class="weather-main-line">
            <div>
                <div><strong>${cityName}</strong></div>
                <div class="weather-temp">${temp}°F</div>
            </div>
            <img class="weather-icon" src="${iconUrl}" alt="${condition}">
        </div>
        <div class="weather-meta">
            <div><strong>Condition:</strong> ${condition}</div>
            <div><strong>Feels like:</strong> ${feelsLike}°F</div>
            <div><strong>High / Low:</strong> ${high}°F / ${low}°F</div>
            <div><strong>Local time:</strong> ${localTime}</div>
        </div>
    `;
}

async function updateWeatherForSelectedCity() {
    const select = document.getElementById("citySelect");
    const container = document.getElementById("weatherDisplay");
    if (!select || !container) return;

    const cityKey = select.value;

    container.innerHTML = "<p>Loading weather...</p>";

    try {
        const data = await fetchWeather(cityKey);
        renderWeather(data);
    } catch (err) {
        container.innerHTML = "<p>Unable to load weather right now.</p>";
    }
}

// ====== Init ======
window.addEventListener("load", () => {
    const select = document.getElementById("citySelect");
    if (!select) return;

    // Default: New York
    select.value = "New York,US";
    updateWeatherForSelectedCity();

    // Change handler
    select.addEventListener("change", () => {
        updateWeatherForSelectedCity();
    });

    // Auto-refresh every 15 minutes
    setInterval(updateWeatherForSelectedCity, 15 * 60 * 1000);
});