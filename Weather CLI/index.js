const request = require('request');
const argv = require('yargs').argv;
//const input = prompt();
let apiKey = '50a7aa80fa492fa92e874d23ad061374';
//const city = input("Enter Your city ");
let city = argv.c || 'portland';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body)
    let message = `It's ${weather.main.temp} °C in ${weather.name}!`;
    console.log(message);
  }
});