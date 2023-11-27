
// index.js
const { fetchMyIP } = require('./iss');
const { fetchCoordsByIP } = require('./iss');
//const { fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);

  fetchCoordsByIP(ip, (error, coords) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    console.log(coords);

    /**fetchISSFlyOverTimes(coords, (error, flytimesArr) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
      console.log(flytimesArr);
    });*/
  });
});