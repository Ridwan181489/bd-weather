// ===== TIME =====
function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("date").textContent =
    now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
}
setInterval(updateTime, 1000);
updateTime();

// ===== DISTRICTS =====
const districts = [
  "Bagerhat","Bandarban","Barguna","Barisal","Bhola","Bogra","Brahmanbaria",
  "Chandpur","Chittagong","Chuadanga","Cox's Bazar","Dhaka",
  "Dinajpur","Faridpur","Feni","Gaibandha","Gazipur","Gopalganj","Habiganj",
  "Jamalpur","Jashore","Jhenaidah","Joypurhat","Khagrachari","Khulna",
  "Kishoreganj","Kurigram","Kushtia","Lakshmipur","Madaripur","Magura",
  "Manikganj","Moulvibazar","Munshiganj","Mymensingh","Naogaon","Narayanganj",
  "Narsingdi","Natore","Netrokona","Nilphamari","Noakhali","Pabna",
  "Panchagarh","Patuakhali","Rajbari","Rajshahi","Rangamati","Rangpur",
  "Satkhira","Shariatpur","Sherpur","Sirajganj","Sunamganj","Sylhet",
  "Tangail","Thakurgaon"
];

const input = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");
const weatherDiv = document.getElementById("weather");

// ===== AUTOCOMPLETE =====
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  suggestions.innerHTML = "";
  if (!value) return;

  districts
    .filter(d => d.toLowerCase().startsWith(value))
    .slice(0, 6)
    .forEach(d => {
      const div = document.createElement("div");
      div.className = "autocomplete-suggestion";
      div.textContent = d;
      div.onclick = () => {
        input.value = d;
        suggestions.innerHTML = "";
        fetchWeather(d);
      };
      suggestions.appendChild(div);
    });
});

document.addEventListener("click", e => {
  if (e.target !== input) suggestions.innerHTML = "";
});

// ===== WEATHER FETCH =====
function fetchWeather(city) {
  if (!city) {
    weatherDiv.innerHTML = `<p style="color:red">❌ Wrong input</p>`;
    return;
  }

  weatherDiv.innerHTML = "Loading...";

  fetch(`/api/weather?city=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {

      if (data.error) {
        weatherDiv.innerHTML = `<p style="color:red">❌ ${data.error}</p>`;
        return;
      }

      weatherDiv.innerHTML = `
        <h3>${data.city}, ${data.country}</h3>
        <div class="temp">${Math.round(data.temp)}°C</div>
        <div class="feels">Feels like ${Math.round(data.feels_like)}°C</div>
      `;
    })
    .catch(err => {
      console.error(err);
      weatherDiv.innerHTML =
        "<p style='color:red'>API Failed</p>";
    });
}

// DEFAULT LOAD
fetchWeather("Dhaka");
