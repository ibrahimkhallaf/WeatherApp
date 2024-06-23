
var Loc_input = document.getElementById("Loc_input");

var today_DayName = document.getElementById("today_DayName");
var today_Day = document.getElementById("today_Day");
var today_month = document.getElementById("today_month");
var today_loc = document.getElementById("today_loc");
var today_temp = document.getElementById("today_temp");
var today_cond_img = document.getElementById("today_cond_img");
var today_cond_text = document.getElementById("today_cond_text");
var humnity = document.getElementById("humnity");
var wind = document.getElementById("wind");
var wind_direct = document.getElementById("wind_direct");


var item_DayName = document.getElementsByClassName("item_DayName");
var item_cond_img = document.getElementsByClassName("item_cond_img");
var item_temp = document.getElementsByClassName("item_temp");
var item_min_temp = document.getElementsByClassName("item_min_temp");
var item_cond_text = document.getElementsByClassName("item_cond_text");

async function getWeatherData(location){
    try{
        var responseData = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3f7a28efa12e439ead6180109242206&q=${location}&days=3`);
        var data = await responseData.json();
        console.log(data)
        return data;
    }
    catch(error){
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function TodayData(data){
    var todayDate = new Date();
    console.log(todayDate);
    today_Day.innerHTML =  todayDate.getDate();
    today_DayName.innerHTML = todayDate.toLocaleDateString("en-Us",{weekday:"long"})
    today_month.innerHTML = todayDate.toLocaleDateString("en-Us",{month:"long"})
    today_loc.innerHTML = data.location.name;
    today_temp.innerHTML = data.current.temp_c;
    today_cond_img.setAttribute("src","https:" + data.current.condition.icon)
    today_cond_text.innerHTML = data.current.condition.text;
    humnity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph;
    wind_direct.innerHTML = data.current.wind_dir ;
}

 function NextData(data){
    var forecastData = data.forecast.forecastday;
    console.log(forecastData);
    for ( var i = 0 ; i < 2 ; i++){
        console.log(forecastData[i+1].date);
        var NextDate = new Date (forecastData[i+1].date);
        console.log(NextDate);
        item_DayName[i].innerHTML = NextDate.toLocaleDateString("en-Us",{weekday:"long"});
        item_cond_img[i].setAttribute("src","https:" + forecastData[i+1].day.condition.icon); 
        item_temp[i].innerHTML = forecastData[i+1].day.maxtemp_c;
        item_min_temp[i].innerHTML = forecastData[i+1].day.mintemp_c;
        item_cond_text[i].innerHTML = forecastData[i+1].day.condition.text;
    }
}

async function startApplication(location='cairo'){
    var weatherdata = await getWeatherData(location);
    if (weatherdata) {
        TodayData(weatherdata);
        NextData(weatherdata);
    } else {
        console.error("Unable to fetch  data from location.");
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var location = `${lat},${lon}`;
            startApplication(location);
        }, function (error) {
            console.error('Error getting location:', error);
            startApplication('cairo');
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        startApplication('cairo'); 
    }
}
document.getElementById('submit').addEventListener('click',
    async function searchLocation() {
    var location =  Loc_input.value;
    if (location) {
        var weatherdata = await getWeatherData(location);
        if (weatherdata) {
            TodayData(weatherdata);
            NextData(weatherdata);
        } else {
            console.error("Unable to fetch  data from location.");
        }
    } else {
        console.error("No location entered.");
    }
})

getLocation();


