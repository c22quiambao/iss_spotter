
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

 request(url, (error, response,body) => {
  if (error) return callback(errMsg, null);

  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    callback(Error(msg), null);
    return;
    }

    const data = JSON.parse(body);
    const ipAdd = data.ip;
    callback(null ,ipAdd);
  });
}

const fetchCoordsByIP = function (ip, callAPI) {
  const url = `http://ipwho.is/${ip}?fields=latitude,longitude`;
  //const url = `http://ipwho.is/42`;
  request(url, (error, response, body) => {
    const data = JSON.parse(body);
    if (data.success===false) {
        const msg = `Error: Success status was false. Server messages says: ${data.message} when fetching for IP ${ip}`;
        return callAPI(msg, null);
    };
    if (error) return callAPI(errMsg, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} calling ipwho.is. Response: ${body}`;
      callAPI(Error(msg), null);
      return;
      }
    return callAPI(null ,body);
    });
}


module.exports = { fetchMyIP, fetchCoordsByIP };