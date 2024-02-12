const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const { getWeather, getPointsOfInterest, getExchangeRates } = require("./apidata");
const port = 3000;

const dbConnection = require('./db/dbconnection');

const loginHandler = require('./handlers/loginHandler');
const registerHandler = require('./handlers/registerHandler');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get("/weatherpage", async (req, res) => {
    if (req.session.user) {
        try {
            const city = req.query.city || "Astana";
            const [weatherData, poiData, exchangeRates] = await Promise.all([
                getWeather(city),
                getPointsOfInterest(city),
                getExchangeRates()
            ]);
    
            res.render('weather', {
                name: weatherData.name,
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
                coordinates: {
                    latitude: weatherData.coord.lat,
                    longitude: weatherData.coord.lon
                },
                feelsLike: weatherData.main.feels_like,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                windSpeed: weatherData.wind.speed,
                countryCode: weatherData.sys.country,
                rainVolumeLast3Hours: weatherData.rain ? weatherData.rain["3h"] : 0,
                pointsOfInterest: poiData.all,
                exchange: exchangeRates.conversion_rates.KZT, 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching weather data");
        }
    } else {
        res.redirect('/login');
    }
});

app.get("/coordinates", async (req, res) => {
    try {
        const city = req.query.city || "Astana";
        const coordinates = await getCoordinates(city);
        res.json({ coordinates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching coordinates" });
    }
});

app.get('/login', loginHandler.getLoginPage);
app.post('/login', loginHandler.handleLogin);

app.get('/register', registerHandler.getRegistrationPage);
app.post('/register', registerHandler.handleRegistration);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
