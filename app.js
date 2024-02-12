const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const WeatherData = require('./models/WeatherData');
const ExchangeData = require('./models/ExchangeData');
const crypto = require('crypto')
const { getWeather, getPointsOfInterest, getExchangeRates, getChuckNorrisJoke } = require("./apidata");
const port = 3001;

const dbConnection = require('./db/dbconnection');

const loginHandler = require('./handlers/loginHandler');
const registerHandler = require('./handlers/registerHandler');
const JokeData = require('./models/ChuckNoriesJokes');

const secretKey = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/weather', (req, res) => {
    if (req.session.user) {
        res.render('weather', {
            name: null,
            coordinates: null
        });
    } else {
        res.redirect('/login');
    }
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
            
            const weatherEntry = new WeatherData({
                user: req.session.user._id,
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
                exchange: exchangeRates.conversion_rates.KZT,
            });

            await weatherEntry.save();

            res.render('weather', {
                user: req.session.user._id,
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


app.get('/exchange-pg', (req, res) => {
    if (req.session.user) {
        res.render('exchange', {
            rate: null,
            baseCurrency: null
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/chuckNorrisJokes', (req, res) => {
    if (req.session.user) {
        res.render('jokes', {
            joke: null
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/getChuckNorrisJoke', async (req, res) => {
    if (req.session.user) {
        const [chuckNorrisJokes] = await Promise.all([
            getChuckNorrisJoke()
        ]);
        try {
            const response = new JokeData({
                user: req.session.user._id, 
                joke: chuckNorrisJokes.value
            });
            await response.save();

            res.render('jokes', response)
        } catch (error) {
            console.error('Error fetching Chuck Norris joke:', error);
            res.status(500).json({ error: 'Error fetching Chuck Norris joke' });
        }                                                                               
    } else {
        res.redirect('/login');
    }
});

app.get('/exchange', async (req, res) => {
    if (req.session.user) {

        const { base, target } = req.query;
        const [exchangeRates] = await Promise.all([
            getExchangeRates()
        ]);
        let rate = ""
        try {
            if (target == "EUR") {
                rate = exchangeRates.conversion_rates.EUR
            } else if (target == "RUB") {
                rate = exchangeRates.conversion_rates.RUB
            } else if (target == "KZT") {
                rate = exchangeRates.conversion_rates.KZT
            } 

            const exchangeEntry = new ExchangeData({
                user: req.session.user._id, 
                baseCurrency: base,
                targetCurrency: target,
                rate: rate
            });
            await exchangeEntry.save();

            res.render('exchange', { baseCurrency: base, targetCurrency: target, rate: rate });
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            res.status(500).send('Error fetching exchange rate.');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/history', async (req, res) => {
    if (req.session.user) {
        try {
            const userWeatherData = await WeatherData.find({ user: req.session.user._id });
            const userExchangeData = await ExchangeData.find({ user: req.session.user._id });
            const userJokesData = await JokeData.find({ user: req.session.user._id });
            
            res.render('history', { userWeatherData, userExchangeData, userJokesData });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching weather history");
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

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/login', loginHandler.getLoginPage);
app.post('/login', loginHandler.handleLogin);

app.get('/register', registerHandler.getRegistrationPage);
app.post('/register', registerHandler.handleRegistration);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
