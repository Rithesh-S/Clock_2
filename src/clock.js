import './App.css';
import React, { useEffect, useState } from 'react';

function Clock() {
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [weather, setWeather] = useState({ description: '-', temperature: '-°C' });
  const [time, setTime] = useState({ hour: '-', minute: '-', second: '-', ampm: '-' });
  const [date, setDate] = useState({ day: '-', date: '-', month: '-'});
  const [battery, setBattery] = useState('-%');
  const [batteryIndicator, setBatteryIndicator] = useState('-');

  useEffect(() => {

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(position => { 
        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        setLocation({latitude,longitude})
      })
    }

    const fetchData = () => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=5dbc9f8305c168560a9ced7e34292794`)
        .then(response => response.json())
        .then(data => {
          let description = data.weather[0].description;
          let temperature = (data.main.temp - 273.15).toFixed(0) + '°C';
          setWeather({ description, temperature });
          console.log("Weather data fetched successfully!");
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });
    };

    const updateTime = () => {
      const currentDate = new Date();
      let ampm = 'AM';
      let hour = currentDate.getHours();
      if (hour > 12) {
        hour = String(currentDate.getHours() - 12).padStart(2, '0');
        ampm = 'PM';
      }
      if (hour === 0) {
        hour = 12;
      }
      const minute = String(currentDate.getMinutes()).padStart(2, '0');
      const second = String(currentDate.getSeconds()).padStart(2, '0');
      setTime({ hour, minute, second, ampm });
    };

    const updateDate = () => {
      const currentDate = new Date();
      let date = currentDate.getDate();
      let month,day;
      switch(currentDate.getDay()) {
        case 0:
          day = 'Sunday';
          break;
        case 1:
          day = 'Monday';
          break;
        case 2:
          day = 'Tuesday';
          break;
        case 3:
          day = 'Wednesday';
          break;
        case 4:
          day = 'Thursday';
          break;
        case 5:
          day = 'Friday';
          break;
        case 6:
          day = 'Saturday';
          break;
        default :
          day = '-';
      }
      switch (currentDate.getMonth()) {
        case 0:
          month = 'Jan';
          break;
        case 1:
          month = 'Feb';
          break;
        case 2:
          month = 'Mar';
          break;
        case 3:
          month = 'Apr';
          break;
        case 4:
          month = 'May';
          break;
        case 5:
          month = 'Jun';
          break;
        case 6:
          month = 'JUL';
          break;
        case 7:
          month = 'Aug';
          break;
        case 8:
          month = 'Sep';
          break;
        case 9:
          month = 'Oct';
          break;
        case 10:
          month = 'Nov';
          break;
        case 11:
          month = 'Dec';
          break;
        default:
          month = '-';
      }
      setDate({ day, date, month});
    };

    const fetchBatteryStatus = () => {
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          const batteryStatus = () => {
            let batteryPercentage = (battery.level * 100).toFixed(0) + '%';
            setBattery(batteryPercentage);
            let chargingStatus = battery.charging;
            if (battery.level * 100 >= 90) 
              chargingStatus ? setBatteryIndicator('battery_charging_full') : setBatteryIndicator('battery_full');
            else if (battery.level * 100 >= 70) 
              chargingStatus ? setBatteryIndicator('battery_charging_90') : setBatteryIndicator('battery_5_bar');
            else if (battery.level * 100 >= 60) 
              chargingStatus ? setBatteryIndicator('battery_charging_80') : setBatteryIndicator('battery_4_bar');
            else if (battery.level * 100 >= 50) 
              chargingStatus ? setBatteryIndicator('battery_charging_50') : setBatteryIndicator('battery_3_bar');
            else if (battery.level * 100 >= 30) 
              chargingStatus ? setBatteryIndicator('battery_charging_30') : setBatteryIndicator('battery_2_bar');
            else if (battery.level * 100 >= 20) 
              chargingStatus ? setBatteryIndicator('battery_charging_20') : setBatteryIndicator('battery_1_bar');
            else if (battery.level * 100 >= 10) 
              chargingStatus ? setBatteryIndicator('battery_charging_20') : setBatteryIndicator('battery_alert');
            else
              chargingStatus ? setBatteryIndicator('battery_charging_20') : setBatteryIndicator('battery_0_bar');

          };
          battery.addEventListener('levelchange', batteryStatus);
          battery.addEventListener('chargingchange',batteryStatus);
          batteryStatus();
        });
      }
    };
  
    fetchLocation();
    fetchData();
    updateDate();
    fetchBatteryStatus();

    const timeIntervalId = setInterval(updateTime, 1000);
    const dateIntervalId = setInterval(updateDate, 60000);


    return () => {
      clearInterval(timeIntervalId);
      clearInterval(dateIntervalId);
    };
  }, [location.latitude, location.longitude]);

  return (
    <>
      <section className='h-screen bg-[#232323] flex-col hidden md:flex'>
        <div className='h-fit bg-[#fffcf6] m-auto rounded-lg shadow-lg bg-[#f4f0f0]'>
          <div className='h-fit p-4 py-6 bg-[#006a6a] flex text-[#fbf8f3] justify-between rounded-t-lg'>
            <div className='flex w-fit h-14 justify-center items-center text-5xl space-x-4 pl-6'>
              <p>{date.month}</p>
              <p>{date.date}</p>
            </div>
            <div className='flex items-end h-14 text-4xl pb-1 pr-6'>
              <div>{date.day}</div>
            </div>
          </div>
          <div className='h-fit p-4 py-8 flex justify-center items-center space-x-6 text-[#5F6368] pl-4 pr-6'>
            <div className='h-fit relative'>
              <svg className="size-56">
                <circle className="bar" cx="110" cy="110" r="90" strokeWidth="5" stroke='#eee7ce' fill='transparent'  />
                <circle className="bar" cx="110" cy="110" r="90" strokeWidth="5" stroke='#006a6a' fill='transparent' strokeDasharray={`${time.hour/12*180*3.14},1000`}  />
              </svg>
              <p className='absolute left-16 top-16 text-7xl w-24 text-center'>{time.hour}</p>
              <p className='absolute left-16 w-24 text-center bottom-16'>HOURS</p>
            </div>
            <div className='h-fit w-fit relative'>
              <svg className="size-56">
                <circle className="bar" cx="110" cy="110" r="90" strokeWidth="5" stroke='#eee7ce' fill='transparent'  />
                <circle className="bar" cx="110" cy="110" r="90" strokeWidth="5" stroke='#006a6a' fill='transparent' strokeDasharray={`${time.minute/60*180*3.14},1000`}  />
              </svg>
              <p className='absolute left-16 top-16 text-7xl w-24 text-center'>{time.minute}</p>
              <p className='absolute left-16 w-24 text-center bottom-16'>MINUTES</p>
            </div>
            <div className='h-fit w-fit relative'>
              <svg className="size-56">
                <circle className="bar" cx="110" cy="110" r="90" strokeWidth="5" stroke='#eee7ce' fill='transparent'  />
                <circle className="bar" cx="110" cy="110" r="90" strokeWidth="5" stroke='#006a6a' fill='transparent' strokeDasharray={`${time.second/60*180*3.14},1000`}  />
              </svg>
              <p className='absolute left-16 top-16 text-7xl w-24 text-center'>{time.second}</p>
              <p className='absolute left-16 w-24 text-center bottom-16'>SECONDS</p>
            </div>
            <div className='h-56 w-fit'>
              <p className='text-4xl w-14 text-center mt-4'>{time.ampm}</p>
            </div>
          </div>
          <div className='h-fit px-4 pb-6 flex justify-between rounded-b-lg text-3xl font-semibold text-[#5F6368]'>
            <div className='flex h-fit'>
              <span class='material-symbols-outlined text-3xl pl-6'>{batteryIndicator}</span>
              <p className='tracking-wide font-semibold'>{battery}</p>
            </div>
            <div className='h-fit w-fit flex items-center space-x-4 pr-6'>
              <p>{weather.temperature}</p>
              <p className='capitalize'>{weather.description}</p>
            </div>
          </div>
        </div>
      </section>
      {/*mbl screen */}
      <section className='h-screen w-screen flex justify-center items-center bg-[#232323] md:hidden'>
        <div className='relative h-fit w-5/6 py-8'>
          <div className='static h-fit w-full bg-[#fffcf6] rounded-lg shadow-lg'>
            <div className='absolute text-[#fbf8f3] text-r-time bg-white items-baseline flex right-3 top-4 shadow-md rounded-lg px-2 py-4 ' style={{backgroundColor:'#006a6a'}}>
              <p>{time.hour}</p>
              <p>:</p>
              <p>{time.minute}</p>
              <p>:</p>
              <p>{time.second}</p>
              <p className='text-r-am pl-px'>{time.ampm}</p>
            </div>
            <div className='h-fit p-4 text-[#5F6368]'>
              <div className='flex space-x-1 text-r-date font-bold p-2'>
                <p>{date.month}</p>
                <p>{date.date}</p>
              </div>
              <p className='px-3 text-r-day'>{date.day}</p>
            </div>
            <div className='flex bg-[#006A6A] text-[#fbf8f3] mt-5 rounded-b-md justify-between text-r-bot items-end p-4 space-x-6'>
              <div className='flex items-end'>
                <div className='flex h-fit items-center'>
                  <span class='material-symbols-outlined text-r-bat pb-1'>{batteryIndicator}</span>
                  <p className='tracking-wide font-semibold'>{battery}</p>
                </div>
              </div>
              <div className='flex flex-wrap justify-end space-x-2 font-medium h-fit'>
                <p className='tracking-tighter'>{weather.temperature}</p>
                <p className='capitalize text-end'>{weather.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Clock;
