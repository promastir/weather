



const axios = require('axios');
const readline = require('readline');
const request = require('request');


//const url = 'https://api.weatherapi.com/v1/current.json?key=91d820be95074c2bbad143258252202&q=egypt&aqi=no';

require('dotenv').config();




const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY || 'e42a450ad03a46aeba90dbba37296ccd';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '91d820be95074c2bbad143258252202';



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});



async function getGeocode(country) {

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${country}&key=${GEOCODE_API_KEY}`;

    try {


        const response = await axios.get(url);

        const data = response.data;

        if (data.results.length > 0) {

            const { lat, lng } = data.results[0].geometry;
            return { latitude: lat, longitude: lng };

        } else {
            throw new Error('Country not found.');
        }

    } catch (error) {
        throw new Error('Failed to fetch geocode data.');
    }
}


async function getWeather(latitude, longitude) {

    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&aqi=no`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        return {
            weather: data.current.condition.text,
            temperature: data.current.temp_c,
        };
    } catch (error) {
        throw new Error('Failed to fetch weather data.');
    }
}



async function main() {



    rl.question('Enter the country name: ', async (country) => {
        try {
            

            const { latitude, longitude } = await getGeocode(country);

            console.log(`\nCountry: ${country}`);
            console.log(`Latitude: ${latitude}`);
            console.log(`Longitude: ${longitude}`);


            
            const { weather, temperature } = await getWeather(latitude, longitude);
            console.log(`Weather: ${weather}`);

            console.log(`Temperature: ${temperature}°C`);
        } catch (error) {

            console.error(`Error: ${error.message}`);

        } finally {
            rl.close();
        }





    });


}


main();

