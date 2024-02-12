const http = require("http");

function getWeather(city) {
    return new Promise((resolve, reject) => {
        const apiKey = "5291eefa398029c38b952d4a10671a3e";
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        http.get(url, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const weatherData = JSON.parse(data);
                resolve(weatherData);
            });
        }).on("error", (error) => {
            reject(error);
        });
    });
}

async function getCoordinates(city) {
    const apiKey = "5291eefa398029c38b952d4a10671a3e";
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const weatherData = await response.json();
    
    const coordinates = {
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon
    };

    return coordinates;
}

async function getPointsOfInterest(city) {
    const apiKey = "5ae2e3f221c38a28845f05b66938d71bb7778874086ac181360e34f7"; 
    const url = `https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${apiKey}`;

    const response = await fetch(url);
    const poiData = await response.json();

    return poiData;
}

const https = require("https");

function getExchangeRates() {
    return new Promise((resolve, reject) => {
        const url = `https://v6.exchangerate-api.com/v6/718558d545977bac404ab378/latest/USD`;

        https.get(url, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const exchangeData = JSON.parse(data);
                resolve(exchangeData);
            });
        }).on("error", (error) => {
            reject(error);
        });
    });
}

module.exports = { getWeather, getCoordinates, getPointsOfInterest, getExchangeRates };


