const timezoneInput = document.getElementById("timezoneInput");
const timeZonesDiv = document.getElementById("timeZones");
const addButton = document.getElementById("addButton");
const convertButton = document.getElementById("convertButton");

// Array to store selected time zones
let selectedZones = [];

// Fetch available time zones for the dropdown
async function fetchTimeZones() {
  const response = await fetch("https://timeapi.io/api/timezone/availabletimezones");
  const timezones = await response.json();
  timezones.forEach(tz => {
    const option = document.createElement("option");
    option.value = tz;
    option.textContent = tz;
    timezoneInput.appendChild(option);
  });
}

// Add selected time zone to the array
addButton.addEventListener("click", () => {
  const selectedTimeZone = timezoneInput.value;
  if (selectedTimeZone && !selectedZones.includes(selectedTimeZone)) {
    selectedZones.push(selectedTimeZone);
    document.getElementById("textbox").innerHTML += `${selectedTimeZone}<br>`;
  }
});

// Fetch and display current times for selected time zones
async function displayCurrentTimes() {
  timeZonesDiv.innerHTML = ""; // Clear previous times

  for (const zone of selectedZones) {
    const response = await fetch(`https://timeapi.io/api/TimeZone/zone?timeZone=${encodeURIComponent(zone)}`);
    const data = await response.json();
    // Parse the currentLocalTime from the API into a Date object
    const apiLocalTime = new Date(data.currentLocalTime);
    const currentLocalTime = new Date();

    // Calculate the difference in hours
    const timeDifference = (currentLocalTime - apiLocalTime) / (1000 * 60 * 60);
    const isBehind = timeDifference > 0;
    const differenceText = `${Math.abs(timeDifference.toFixed(2))} hours ${isBehind ? "behind" : "ahead"}`;

    // Extract day, date, month, and time from the API local time
    const day = apiLocalTime.toLocaleString("en-US", { weekday: "long" });
    const date = apiLocalTime.getDate();
    const month = apiLocalTime.toLocaleString("en-US", { month: "long" });
    const time = apiLocalTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const timeDiv = document.createElement("div");
    timeDiv.innerHTML = `${data.timeZone}: ${day}, ${month} ${date}, ${time} (Difference: ${differenceText})<br>`;
    timeZonesDiv.appendChild(timeDiv);
  }
}

// Initialize dropdown with time zones
fetchTimeZones();

convertButton.addEventListener("click", () => {
    displayCurrentTimes();
  });
  
  function filterTimeZones() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const select = document.getElementById('timezoneInput');
    const options = select.options;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.text.toLowerCase().includes(input)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }
}
