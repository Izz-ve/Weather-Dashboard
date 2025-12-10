const hamburger=document.querySelector('.hamburger')
const elements=document.querySelector('.elements')




function clk(){
    
    hamburger.classList.toggle('active');
    elements.classList.toggle('active');
    
}

hamburger.addEventListener('click',clk);


function c(){
    elements.classList.toggle('active');
    

}
elements.addEventListener('click',function(e){
    
    const target= e.target
    console.log(target)
    if(target.matches('a')){
        c();

    }
})
const url='https://api.weatherapi.com/v1/forecast.json?key=0c64c0201b6e4f6c92b63521251012&q=London&days=1&aqi=no&alerts=no';
const date=document.querySelector('#date')
const getw= async() => {
    console.log('getting data...');
    let r = await fetch(url);
    let data= await r.json()
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dat=data['forecast']['forecastday'][0]['date'];
    let dateObj = new Date(dat);
    let week_day=weekdays[dateObj.getDay()]
    
    console.log(data['forecast']);
    
    let humid1=data['forecast']['forecastday'][0]['day']['avghumidity']
    let tempavg=data['forecast']['forecastday'][0]['day']['avgtemp_c']
    let tempmax=data['forecast']['forecastday'][0]['day']['maxtemp_c']
    let tempmin=data['forecast']['forecastday'][0]['day']['mintemp_c']
    let Sunrise=data['forecast']['forecastday'][0]['astro']['sunrise']
    let Sunset=data['forecast']['forecastday'][0]['astro']['sunset']
    let windspeed=data['forecast']['forecastday'][0]['day']['maxwind_kph']
    let typew=data['forecast']['forecastday'][0]['day']['condition']['text']
    let typewicon=data['forecast']['forecastday'][0]['day']['condition']['icon']
    ct.innerHTML=`<h2>City</h2><h3>${typew} <img  src='${typewicon}' style="height:28px;margin-bottom: -7px;"></h3><date>${dat}</date><p>${week_day}</p>`
    humid.innerHTML=`<h2>Humidity</h2><p style="font-size:35px;">${humid1}%</p>`
    temperature.innerHTML=`<h2>Temprature</h2><h3>Average : ${tempavg} \u00B0C</h3><h3>Max : ${tempmax} \u00B0C</h3><h3>Min : ${tempmin} \u00B0C</h3>`
    wins.innerHTML=`<h2>Windspeed</h2><p style="font-size:30px;">${windspeed}Kmph</p>`
    atm.innerHTML=`<h2>Sunrise:</h2><h3>${Sunrise}</h3><h2>Sunset:</h2><h3>${Sunset}</h3>`}
const searchInput = document.querySelector('.search');
const searchBtn = document.querySelector('.search_button');


const ct = document.querySelector('.ct');
const temperature = document.querySelector('.temprature');
const humid = document.querySelector('.humidity');
const wins = document.querySelector('.windspeed');
const atm = document.querySelector('.atm');

const API_KEY = '0c64c0201b6e4f6c92b63521251012'; 
function showError(message) {
  
  ct.innerHTML = `<h2>City</h2><h3>${message}</h3>`;
  humid.innerHTML = `<h2>Humidity</h2><p style="font-size:18px;">—</p>`;
  temperature.innerHTML = `<h2>Temprature</h2><p style="font-size:18px;">—</p>`;
  wins.innerHTML = `<h2>Windspeed</h2><p style="font-size:18px;">—</p>`;
  atm.innerHTML = `<h2>Atm. Pressure</h2><p style="font-size:18px;">—</p>`;
}

function renderWeatherFromData(data) {
  try {
    const dayInfo = data.forecast.forecastday[0].day;
    const astro = data.forecast.forecastday[0].astro;
    const dateStr = data.forecast.forecastday[0].date;
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const week_day = weekdays[new Date(dateStr).getDay()];

    const humidVal = dayInfo.avghumidity;
    const tempavg = dayInfo.avgtemp_c;
    const tempmax = dayInfo.maxtemp_c;
    const tempmin = dayInfo.mintemp_c;
    const sunrise = astro.sunrise;
    const sunset = astro.sunset;
    const windspeed = dayInfo.maxwind_kph;
    const conditionText = dayInfo.condition.text;
    const conditionIcon = dayInfo.condition.icon; 
    
    ct.innerHTML = `
      
      <h2 style="font-weight:500; font-size:20px;">${data.location.name}, ${data.location.country}</h2>
      <p style="margin-top:6px;">${week_day} </p>
      <p>${dateStr}</p>
      <p style="margin-top:4px;">
      ${conditionText}
      <img src="${conditionIcon}" alt="" style="height:22px; vertical-align:middle;">
      </p>
    `;

    humid.innerHTML = `<h2>Humidity</h2><p style="font-size:35px;">${humidVal}%</p>`;

    temperature.innerHTML = `
      <h2>Temprature</h2>
      <h3>Average : ${tempavg} \u00B0C</h3>
      <h3>Max : ${tempmax} \u00B0C</h3>
      <h3>Min : ${tempmin} \u00B0C</h3>
    `;

    wins.innerHTML = `<h2>Windspeed</h2><p style="font-size:30px;">${windspeed} Kmph</p>`;

    atm.innerHTML = `<h2>Sunrise: ${sunrise}</h2><h2>Sunset: ${sunset}</h2>`;
  } catch (err) {
    console.error('Render error:', err);
    showError('Unexpected response format');
  }
}

async function fetchWeatherForCity(city) {
  const q = (city || '').trim();
  if (!q) {
    showError('Please enter a city name.');
    return;
  }

  const endpoint = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(q)}&days=1&aqi=no&alerts=no`;

  try {
    // small loading state in ct
    ct.innerHTML = `<h2>City</h2><h3>Loading...</h3>`;
    const res = await fetch(endpoint);
    const data = await res.json();

    
    if (data && data.error) {
      showError(data.error.message || 'City not found.');
      return;
    }

    if (!res.ok) {
      showError(`HTTP error ${res.status}`);
      return;
    }

    // success
    renderWeatherFromData(data);
  } catch (err) {
    console.error(err);
    showError('Network error. Check your connection.');
  }
}


if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => fetchWeatherForCity(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchWeatherForCity(searchInput.value);
    }
  });
} else {
  console.warn('Search input/button not found in DOM.');
}


   searchInput.value = 'New York';