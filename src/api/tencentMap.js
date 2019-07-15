const fetch = require("node-fetch");

const tecentMapEndpoint = "https://apis.map.qq.com/ws";
const key = "SO2BZ-PMT3V-YVKPK-UHGQI-FMBPF-77FQD";

const unconpressPolylineToPoints = coordinates => {
  let coors = JSON.parse(JSON.stringify(coordinates));
  let points = [];
  for (var i = 2; i < coors.length; i++) {
    coors[i] = coors[i - 2] + coors[i] / 1000000;
  }
  for (let j = 0; j < coors.length; j++) {
    points.push({
      latitude: parseFloat(coors[j]),
      longitude: parseFloat(coors[j + 1])
    });
    j++;
  }
  return points;
};

const getDrivingPath = param => {
  const { start, end } = param;
  return fetch(
    `${tecentMapEndpoint}/direction/v1/driving?from=${start}&to=${end}&output=json&key=${key}&policy=LEAST_TIME`
  )
    .then(res => {
      if (res.statusText === "OK") {
        return res.json();
      }
    })
    .then(data => {
      let route = {};
      const {
        result: { routes }
      } = data;
      if (routes.length > 0) {
        const { distance, duration } = routes[0];
        points = unconpressPolylineToPoints(routes[0].polyline);
        route = {
          distance,
          duration,
          polyline: {
            points,
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
          }
        };
      }
      console.log(route);
      return route;
    })
    .catch(err => {
      console.log(err);
    });
};

//
const getPOIs = location => {
  return fetch(
    `${tecentMapEndpoint}/geocoder/v1/?location=${location}&get_poi=1&key=${key}`
  )
    .then(res => {
      if (res.statusText === "OK") {
        return res.json();
      }
    })
    .then(data => {
      const {
        result: { pois }
      } = data;
      console.log(pois);
      return pois;
    })
    .catch(err => {
      console.log(err);
    });
};

getDrivingPath({ start: "39.915285,116.403857", end: "39.915285,116.803857" });