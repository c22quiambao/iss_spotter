
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  const url = `https://api.ipify.org?format=json`;

  request(url, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const ipAdd = data.ip;
    callback(null ,ipAdd);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const url = `http://ipwho.is/${ip}?fields=latitude,longitude`;
  //const url = `http://ipwho.is/42`;
  request(url, (error, response, body) => {
    const data = JSON.parse(body);
    if (data.success === false) {
      const msg = `Error: Success status was false. Server message says: ${data.message} when fetching for IP ${ip}`;
      return callback(msg, null);
    }
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} calling ipwho.is. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    return callback(null ,body);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {

  const data = JSON.parse(coords);

  const url = `https://iss-flyover.herokuapp.com/json/?lat=${data.latitude}&lon=${data.longitude}`;
  //const url = `https://iss-flyover.herokuapp.com/json/?lat=123&lon=123}`;

  request(url, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when getting flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const timeArr = data.response;
    callback(null, timeArr);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(coords, (error, flytimesArr) => {
        if (error) return callback(error, null);

        callback(null, flytimesArr);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };