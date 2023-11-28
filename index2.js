
const { nextISSTimesForMyLocation  } = require('./iss_promised');

nextISSTimesForMyLocation()
.then((passTimes) => {
  for (let element of passTimes) {
    let myDate = new Date(element.risetime * 1000);
    console.log(`Next pass at ${myDate} for ${element.duration} seconds!`);
  };
})
.catch((error) => {
  console.log("It didn't work: ", error.message)
});