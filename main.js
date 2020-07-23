
const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const dayYesterday = getYesterday();
const dayBefore = getDayBefore();
const input = document.getElementById("place");
const btn = document.querySelector(".btn");
btn.addEventListener("click", handleClick);
const baseEndpoint = "https://api.weatherapi.com/v1/forecast.json?key=7abbb4eef01543fdbde124759200807&q=";
const historyEndpoint = "https://api.weatherapi.com/v1/history.json?key=7abbb4eef01543fdbde124759200807&q="

//============INITIAL WEATHER REPORT ELEMENTS======================
const weatherDisplay = document.getElementById("weather_display");
let weatherEl = document.getElementById("weather");
let tempEl = document.getElementById("temp");
let windEl = document.getElementById("wind");
let humidityEl = document.getElementById("humidity");


//============TODAY FORECAST REPORT ELEMENTS========================
let today = document.getElementById("today");
let todayMax = document.getElementById("today_max");
let todayMin = document.getElementById("today_min");
let todayIcon = document.getElementById("today_icon");
let ppToday = document.getElementById("pp_today");

//============TOMORROW FORECAST REPORT ELEMENTS======================
let dayTomorrow = document.getElementById("day1");
let minTomorrow = document.getElementById("day1_min");
let maxTomorrow = document.getElementById("day1_max");
let tomorrowIcon = document.getElementById("tomorrow_icon");
let ppTomorrow = document.getElementById("pp_tomorrow");

//============NEXT DAY FORECAST REPORT ELEMENTS===================
let dayNextDay = document.getElementById("next_day");
let minNextDay = document.getElementById("next_day_min");
let maxNextDay = document.getElementById("next_day_max");
let nextDayIcon = document.getElementById("day_after_icon");
let ppNextDay = document.getElementById("pp_day_after");
//============FOOTER ELEMENTS=================
let twoDaysBeforeFCast = document.getElementById("two_days_before");
let dayBeforeIcon = document.getElementById("day_before_icon");
let celciusDBF = document.getElementById("celcius_dayBF");

let dayBeforeFCast = document.getElementById("day_before");
let twoDaysBeforeIcon = document.getElementById("two_days_icon");
let celciusYD = document.getElementById("celcius_YD");

let dayTodayFCast = document.getElementById("day_today");
let celciusToday = document.getElementById("celcius_today");

let dayTomorrowFCast = document.getElementById("day_tomorrow");
let celciusTMRW = document.getElementById("celcius_tomorrow");

let dayAfterFCast = document.getElementById("day_after_that");
let celciusDA = document.getElementById("celcius_dayAfter");

//============WEATHER MAP===========================================
let weatherMap = document.getElementById("weather_map");

//=============WEATHER WIDGET ELEMENTS==========================
let localForecast = document.getElementById("local_forecast");
let mountainForecast = document.getElementById("mountain_forecast");


function handleClick(){
    fetchWeather(input.value).catch(handleError);  
}

async function fetchWeather(query){
    weatherEl.innerText = "Loading...";

    const newLocation = queryLocation(query);

    //==============fetch data
    const res = await fetch(`${baseEndpoint}${newLocation}&days=3`);
    const resYesterday = await fetch(`${historyEndpoint}${newLocation}&dt=${dayYesterday}`);
    const resDayBefore = await fetch(`${historyEndpoint}${newLocation}&dt=${dayBefore}`);
    const data = await res.json();
    const dataYesterday = await resYesterday.json();
    const dataDayBefore = await resDayBefore.json();

    //==============Add data to variables today
    console.log(data);
    console.log("Yesterday", dataYesterday);
    console.log("Day Before: ", dataDayBefore);
    weatherEl.innerText = 
        `Nearest Town: ${data.location.name}. Condition: ${data.current.condition.text}.`;
    tempEl.innerText = 
        `Current Temp: ${data.current.temp_c}°C. Feeling like: ${data.current.feelslike_c}°C.`;
    windEl.innerText = 
        `Windspeed is: ${data.current.wind_mph} mp/h. Direction: ${windDirection(data.current.wind_dir)}.`;
    humidityEl.innerText = 
        `The humidity is ${data.current.humidity}%, with ${data.current.precip_in} inches of rain currently recorded`;

    //=============Add Forecast to variables today
    today.innerText = "Today";
    todayMax.innerText = `${data.forecast.forecastday[0].day.maxtemp_c}°C`;
    todayMin.innerText = `${data.forecast.forecastday[0].day.mintemp_c}°C`;
    todayIcon.setAttribute("src",data.forecast.forecastday[0].day.condition.icon);
    ppToday.innerText = `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    //=============Add Forecast to variables tomorrow
    dayTomorrow.innerText = getDayOfWeek(data.forecast.forecastday[1].date);
    minTomorrow.innerText = `${data.forecast.forecastday[1].day.mintemp_c}°C`;
    maxTomorrow.innerText = `${data.forecast.forecastday[1].day.maxtemp_c}°C`;
    tomorrowIcon.setAttribute("src",data.forecast.forecastday[1].day.condition.icon);
    ppTomorrow.innerText = `${data.forecast.forecastday[1].day.daily_chance_of_rain}%`;
    //=============Add Forecast to variables day after tomorrow
    dayNextDay.innerText = getDayOfWeek(data.forecast.forecastday[2].date);
    minNextDay.innerText = `${data.forecast.forecastday[2].day.mintemp_c}°C`;
    maxNextDay.innerText = `${data.forecast.forecastday[2].day.maxtemp_c}°C`;
    nextDayIcon.setAttribute("src",data.forecast.forecastday[2].day.condition.icon);
    ppNextDay.innerText = `${data.forecast.forecastday[2].day.daily_chance_of_rain}%`;
    //=============Change Display values====================
    let toggleWidgetDisplay = document.getElementsByClassName("weather_box");
    for(let i = 0; i < toggleWidgetDisplay.length; i++){
        toggleWidgetDisplay[i].style.display = "block";
    }

    let headerIcons = document.getElementsByClassName("header_icon");
    for(let i = 0; i < headerIcons.length; i++){
        headerIcons[i].style.visibility = "visible";
    }
    //==============FOOTER ICONS AND VALUES==================
    let weeklyOutlook = document.getElementsByClassName("weekly_outlook");
    for(let i = 0; i<weeklyOutlook.length; i++){
        weeklyOutlook[i].style.display = "grid";
    }
    //===============FOOTER TEXT===============================
    twoDaysBeforeFCast.innerText = getDayOfWeek(dataDayBefore.forecast.forecastday[0].date);
    dayBeforeFCast.innerText = getDayOfWeek(dataYesterday.forecast.forecastday[0].date);
    dayTodayFCast.innerText = "Today";
    dayTomorrowFCast.innerText = getDayOfWeek(data.forecast.forecastday[1].date);
    dayAfterFCast.innerText = getDayOfWeek(data.forecast.forecastday[2].date);
    //===============FOOTER ICON==============
    dayBeforeIcon.setAttribute("src", dataYesterday.forecast.forecastday[0].day.condition.icon);
    twoDaysBeforeIcon.setAttribute("src", dataDayBefore.forecast.forecastday[0].day.condition.icon);
    //===============FOOTER CELCIUS===========
    celciusDBF.innerText = `${dataDayBefore.forecast.forecastday[0].day.avgtemp_c}°C`;
    celciusYD.innerText = `${dataYesterday.forecast.forecastday[0].day.avgtemp_c}°C`;
    celciusToday.innerText = `${data.forecast.forecastday[0].day.avgtemp_c}°C`;
    celciusTMRW.innerText = `${data.forecast.forecastday[1].day.avgtemp_c}°C`;
    celciusDA.innerText = `${data.forecast.forecastday[2].day.avgtemp_c}°C`;


}

function handleError(err){
    console.log(err);
    console.log("Oh no! Something went wrong!");
    if(!input.value){
        weatherEl.textContent = "Looks like you didn't make a selection. Please select a location from the drop-down menu above."
    }else{
        weatherEl.textContent = `Something went wrong: ${err}`;
    }
}

function windDirection(windDir){
    const direction = [];
    const windDrSplit = windDir.split("");
    if(windDrSplit[0] === "S"){
        direction.push("south")
    }
    if(windDrSplit[0] === "N"){
        direction.push("north")
    }
    if(windDrSplit[0] === "E"){
        direction.push("east")
    }
    if(windDrSplit[0] === "W"){
        direction.push("west")
    }
    if(windDrSplit[1] === "S"){
        direction.push("south")
    }
    if(windDrSplit[1] === "N"){
        direction.push("north")
    }
    if(windDrSplit[1] === "E"){
        direction.push("east")
    }
    if(windDrSplit[1] === "W"){
        direction.push("west")
    }
    if(windDrSplit[2] === "W"){
        direction.push("westerly");
    }
    if(windDrSplit[2] === "E"){
        direction.push("easterly");
    }
    return direction.join(" ");
}

function queryLocation(location){
    let newLocation = '';
    if (location === "cornwall"){
        newLocation = "50.067833062%20-5.709663828";
        return newLocation;
    }
    if (location === "pembroke"){
        newLocation = "51.89531 -5.29557";
        return newLocation;
    }
    if (location === "ben_nevis"){
        newLocation = "56.79657 -5.00323";
        return newLocation;
    }
    if (location === "malham_cove"){
        newLocation = "54.0728 -2.1579";
        return newLocation;
    }
    if (location === "gower"){
        newLocation = "51.57865 -4.29303";
        return newLocation;
    }
    if (location === "stoney"){
        newLocation = "53.27729 -1.65866";
        return newLocation;
    }
    if (location === "llanberis_pass"){
        newLocation = "53.10590 -4.08815";
        return newLocation;
    }
    if (location === "portland"){
        newLocation = "50.56660 -2.45410";
        return newLocation;
    }
    if (location === "st_bees"){
        newLocation = "54.48393 -3.59295";
        return newLocation;
    }
    if (location === "peak_millstone"){
        newLocation = "53.31652 -1.62376";
        return newLocation;
    }
    else{
        return location;
    }
}
function getDayOfWeek(dayz){
    let useDate = new Date(dayz);
    return weekday[useDate.getDay()];
}
function getYesterday(){
    let today = new Date();
    let yesterday = new Date(today.getTime() - 24*60*60*1000);
    let year = yesterday.getFullYear();
    let month = yesterday.getMonth()+1;
    let day = yesterday.getDate();
    return (year+"-"+month+"-"+day);
}
function getDayBefore(){
    let today = new Date();
    let dayBefore = new Date(today.getTime() - (24*60*60*1000)*2);
    let year = dayBefore.getFullYear();
    let month = dayBefore.getMonth()+1;
    let day = dayBefore.getDate();
    return (year+"-"+month+"-"+day);
}

//=================THINGS TO ADD================
//4. icons for wind direction?
//6. links to Met office widgets
//7. UV, Pollen + pollution?
//8. Area info (nearby crags etc.)
//10. Link new page with Met Office widgets?