const client = require("./../db/redisClient");
const _ = require('lodash')

const getpolylineByPath = path => {
  const points = [];
  const polyline = [
    {
      points: [],
      color: "#0091ff",
      width: 6
    }
  ];
  if (!path) {
    return polyline;
  }
  const { steps } = path;
  if (steps && steps.length > 0) {
    for (let i = 0; i < steps.length; i++) {
      const { polyline } = steps[i];
      let polyArr = polyline.split(";");
      for (let j = 0; j < polyArr.length; j++) {
        points.push({
          longitude: parseFloat(polyArr[j].split(",")[0]),
          latitude: parseFloat(polyArr[j].split(",")[1])
        });
      }
    }
    polyline[0].points = points;
  } else {
    return polyline;
  }
  return polyline;
};

const simulateCarDriving = async (routeValue) => {
  //setup
  if (!routeValue) {
    return;
  }
  const route= JSON.parse(JSON.stringify(routeValue))
  const {polyline} = route
  const { points } = polyline[0];
  var pulled = [];
  //simulate car moving 
  await sleep(1000);
  pulled = _.pullAt(points,[0]);
  console.log(pulled)
  if(pulled.length === 0){
    return
  }
  await client.set(
    "driver-current-coordinate",
    pulled[0].longitude + "," + pulled[0].latitude
  );
  // await client.set("route-path", JSON.stringify(route));
  return route;
};

const simulateCarDrivingByPoints = async (points) => {
  //setup
  var pulled = [];
  //simulate car moving 
  await sleep(1000);
  pulled = _.pullAt(points,[0]);
  if(pulled.length === 0){
    return
  }
  await client.set(
    "driver-current-coordinate",
    pulled[0].longitude + "," + pulled[0].latitude
  );
  await client.set('route-points', JSON.stringify(points))
  // await client.set("route-path", JSON.stringify(route));
};

const sleep = (ms) =>{
  return new Promise(resolve =>{
    setTimeout(resolve, ms);
  })
}

exports.getpolylineByPath = getpolylineByPath;
exports.simulateCarDriving = simulateCarDriving;
exports.simulateCarDrivingByPoints = simulateCarDrivingByPoints;
