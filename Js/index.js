const cityinput = document.querySelector(".City-input");
const searchbtn = document.querySelector(".btn-search");

const NotFoundSection = document.querySelector(".notfound-city");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const ApiKey= "39117c1f5ed1b9b66904dc8aca66c98f";

// catch all element to display the data....

const countrytxt = document.querySelector('.country-txt');
const currentDate = document.querySelector('.current-date-txt');
const tempvalue = document.querySelector('.temp-text');
const conditiontxt = document.querySelector('.condition-txt');
const WindValue = document.querySelector('.Wind-value-txt');
const HumidityValue = document.querySelector('.Humidity-value-txt');
const weatherSammaryimg = document.querySelector('.container-weather-img');
const foreCastContainer = document.querySelector('.forecast-items-container');


searchbtn.addEventListener('click',()=>{
    if (cityinput.value.trim() != "") {

        updateWeatherInfo(cityinput.value);
        cityinput.value=""
        cityinput.blur();
    }
});
cityinput.addEventListener('keydown',(event)=>{
    if (event.key == "Enter" && cityinput.value.trim() != "") {
        updateWeatherInfo(cityinput.value);
        cityinput.value=""
        cityinput.blur();
    }
})

function getWeatherIcon(id){
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id <= 800) return 'clear.svg';
    else return "clouds.svg"
}
function getCurrentDate(){
    const currentDate= new Date();
    const options ={
        weekday : "short",
        day: '2-digit',
        month: "short",

    }
    return currentDate.toLocaleDateString('en-GB',options);
}
async function getFetchData(endPoint , cityName){
let apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${cityName}&appid=${ApiKey}&units=metric`;
let response =await fetch(apiUrl)
let finalResponse =await response.json();

return finalResponse;
}
async function updateWeatherInfo(city){
const weatherData =await getFetchData('weather',city);
if (weatherData.cod != 200) {
    showDisplaySection(NotFoundSection);
    return;
}
const {
    name:country,
    main: {temp , humidity},
    weather:[{id,main}],
    wind:{speed}
}=weatherData;

countrytxt.textContent=country;
 currentDate.innerHTML=getCurrentDate();
tempvalue.textContent=Math.round(temp) + '°C';
conditiontxt.textContent=main
WindValue.textContent=speed + " " +'M/s'
HumidityValue.textContent = humidity + '%'
weatherSammaryimg.src=`Images/weather/${getWeatherIcon(id)}`
await updateForeCastInfo(city);
showDisplaySection(weatherInfoSection);

}

function updateForeCastItems(forecastData){
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
      } = forecastData;
      let dateTaken = new Date(date);
      let dayOption={
        day:'2-digit',
        month:'short'
      }
      let dateResult =dateTaken.toLocaleDateString("en-US",dayOption);
      const forecastItem = `
        <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img src="Images/weather/${getWeatherIcon(id)}" class="forecast-item-img">
        <h5 class="forecast-item-temp regular-txt">${Math.round(temp)} °C</h5>
      </div>

      `
      foreCastContainer.insertAdjacentHTML('beforeend',forecastItem);
}
async function updateForeCastInfo(city){
    const ForeCastData = await getFetchData('forecast',city);
    const timeTaken="12:00:00";
    const TodayDate= new Date().toISOString().split("T")[0];
    foreCastContainer.innerHTML = ""
    ForeCastData.list.forEach(forecastWeather=>{
        if (forecastWeather.dt_txt.includes(timeTaken)&& !forecastWeather.dt_txt.includes(TodayDate)) {
            updateForeCastItems(forecastWeather);
        }
    })
}
function showDisplaySection(section){
    [weatherInfoSection, searchCitySection,NotFoundSection].forEach(section=>section.style.display="none");
    section.style.display='flex'
}
