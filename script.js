async function getWeather(){
    const location = document.getElementById('locationInput').value;
    
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${location}`;
    
    try{
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.results.length === 0){
            alert('Location not found. Please try again.');
            return;
        }

        const { latitude, longitude, name, country } = geocodeData.results[0];

        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=auto`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        document.querySelector('.location').textContent = `${name}, ${country}`;
        document.querySelector('.month').textContent = new Date().toLocaleString('en-US', { month: 'long' });

        const weatherConditions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Drizzle: Light',
            53: 'Drizzle: Moderate',
            55: 'Drizzle: Dense intensity',
            56: 'Freezing Drizzle: Light',
            57: 'Freezing Drizzle: Dense intensity',
            61: 'Rain: Slight',
            63: 'Rain: Moderate',
            65: 'Rain: Heavy intensity',
            66: 'Freezing Rain: Light',
            67: 'Freezing Rain: Heavy intensity',
            71: 'Snow fall: Slight',
            73: 'Snow fall: Moderate',
            75: 'Snow fall: Heavy intensity',
            77: 'Snow grains',
            80: 'Rain showers: Slight',
            81: 'Rain showers: Moderate',
            82: 'Rain showers: Violent',
            85: 'Snow showers slight',
            86: 'Snow showers heavy',
            95: 'Thunderstorm: Slight or moderate',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };

        for(let i = 0; i < 3; i++){
            const dayElement = document.getElementById(`day${i + 1}`);

            const date = new Date(data.daily.time[i]).toLocaleDateString('en-US', { weekday: 'long' });
            const conditions = weatherConditions[data.daily.weathercode[i]];
            const temp = `Max: ${data.daily.temperature_2m_max[i]} °C, Min: ${data.daily.temperature_2m_min[i]} °C`;
            const wind = `${data.daily.windspeed_10m_max[i]} m/s`;
            const precipitation = `${data.daily.precipitation_sum[i]} mm`;

            dayElement.querySelector('.day').textContent = date;
            dayElement.querySelector('.conditions').textContent = conditions;
            dayElement.querySelector('.temp').textContent = temp;
            dayElement.querySelector('.wind').textContent = wind;
            dayElement.querySelector('.precipitation').textContent = precipitation;
        }
    } 
    catch (error){
        console.error('Error fetching the weather data:', error);
        alert('Error fetching the weather data. Please try again later.');
    }
}