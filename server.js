// server.js
// where your node app starts
// Diagram: https://www.draw.io/#G1nB9Ej2tU7lEbJvR39t49EQjLhnO6b0tg

// init project
const express = require('express');
const ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const Map = require('es6-map');

// Pretty JSON output for logs
const prettyjson = require('prettyjson');
// Join an array of strings into a sentence
// https://github.com/epeli/underscore.string#tosentencearray-delimiter-lastdelimiter--string
const toSentence = require('underscore.string/toSentence');

app.use(bodyParser.json({type: 'application/json'}));

// This boilerplate uses Express, but feel free to use whatever libs or frameworks
// you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Uncomment the below function to check the authenticity of the API.AI requests.
// See https://docs.api.ai/docs/webhook#section-authentication
/*app.post('/', function(req, res, next) {
  // Instantiate a new API.AI assistant object.
  const assistant = new ApiAiAssistant({request: req, response: res});
  
  // Throw an error if the request is not valid.
  if(assistant.isRequestFromApiAi(process.env.API_AI_SECRET_HEADER_KEY, 
                                  process.env.API_AI_SECRET_HEADER_VALUE)) {
    next();
  } else {
    console.log('Request failed validation - req.headers:', JSON.stringify(req.headers, null, 2));
    
    res.status(400).send('Invalid request');
  }
});*/

// Handle webhook requests
app.post('/', function(req, res, next) {
  // Log the request headers and body, to aide in debugging. You'll be able to view the
  // webhook requests coming from API.AI by clicking the Logs button the sidebar.
  logObject('Request headers: ', req.headers);
  logObject('Request body: ', req.body);
    
  // Instantiate a new API.AI assistant object.
  const assistant = new ApiAiAssistant({request: req, response: res});

  // Declare constants for your action and parameter names
  // values in quotes come from DialogFlow Intent configuration "Actions and Parameters" field
  const ASK_WEATHER_ACTION = 'askWeather';  // The action name from the API.AI intent
  const CITY_PARAMETER = 'geo-city'; // An API.ai parameter name
  const HELP_ACTION = 'help'
  const CHECKSCHOOL_ACTION = 'checkSchool'
  const WELCOME_ACTION = 'input.welcome'
  
  // Create functions to handle intents here
  function welcome(assistant) {
    console.log('Handling action: ' + WELCOME_ACTION);
    assistant.tell('Hello, welcome to is school open');
  }
  
  function checkSchool(assistant) {
  // Looks up school status
    console.log('Handling action: ' + CHECKSCHOOL_ACTION);
    //assistant.tell('Checking on your school ...');
    let schoolname="Sainte-Anne";  // TODO: make this a parameter
    let schoolRequestURL = "http://francophonesud.nbed.nb.ca/retards/";
    let cheerio = require('cheerio');
    request(schoolRequestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        // Setup $ with cheerio for javascript DOM like queries
        let $ = cheerio.load(response.body);
        // Locate the TD element containing the schoolname and grab the text in the next TD
        let schoolstatus_fr = $("td").filter(function() {
          return $(this).text() == schoolname;
        }).next().text()
        // TODO: results are currently in french, make a lookup or call translate for english
        // TODO: handle a failed lookup of the school name
        // TODO: also parse out the last update time of page giving status and include "as of $time" in the response
        // Send results to console
        logObject('School URL call response: ', schoolstatus_fr);
        // Send results to Google DialogFlow calling us
        assistant.tell("Your school is " + schoolstatus_fr + " today");
      }
    }
           )
  }
  
  function help(assistant) {
  // Currently unused
    console.log('Handling action: ' + HELP_ACTION);
    assistant.tell('Try saying ask the weather');
  }
  
  function getWeather(assistant) {
  // Currently unused
    console.log('Handling action: ' + ASK_WEATHER_ACTION);
    let city = assistant.getArgument(CITY_PARAMETER);
    
    // Make an API call to fetch the current weather in the requested city.
    // See https://developer.yahoo.com/weather/
    let weatherRequestURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast" +
        "%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" +
        encodeURIComponent(city) +
        "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
    
    request(weatherRequestURL, function(error, response) {
      if(error) {
        next(error);
      } else {        
        let body = JSON.parse(response.body);
        logObject('Weather API call response: ', body);
        
        let units = body.query.results.channel.units.temperature == 'F' ? 'Fahrenheit' : 'Celsius';
        let temperature = body.query.results.channel.item.condition.temp;
        
        // Respond to the user with the current temperature.
        assistant.tell('The current temperature in ' + city + ' is ' + temperature + ' degrees ' + units);
      }
    });
  }
  
  // Add handler functions to the action router.
  let actionRouter = new Map();
  
  // Map all the ACTIONs to the functions to handle them
  actionRouter.set(ASK_WEATHER_ACTION, getWeather);
  actionRouter.set(HELP_ACTION, help);
  actionRouter.set(CHECKSCHOOL_ACTION, checkSchool);
  //actionRouter.set(WELCOME_ACTION, welcome);
  actionRouter.set(WELCOME_ACTION, checkSchool);

  // Route requests to the proper handler functions via the action router.
  assistant.handleRequest(actionRouter);
});

// Handle errors.
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Pretty print objects for logging.
function logObject(message, object, options) {
  console.log(message);
  console.log(prettyjson.render(object, options));
}

// Listen for requests.
let server = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + server.address().port);
});

