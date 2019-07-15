const WebSocket = require("ws");
const _ = require("lodash");
const client = require("./../db/redisClient");
const { getDrivingPath } = require("./../api/aMap");
const { simulateCarDrivingByPoints } = require("./../utils/path");
const logger = require("./../utils/logger");

const wss = new WebSocket.Server({ port: 9090 });
wss.on("connection", ws => {
  logger.info("websocket connection setup");
  ws.on("message", async data => {
    const obj = JSON.parse(data);
    console.log(obj);
    if (obj.type === "driver-check") {
      const driverCoordinate = await client.get("driver-current-coordinate");
      if (driverCoordinate == "undefined") {
        ws.send(
          JSON.stringify({
            coordinate: {
              latitude: "",
              longitude: ""
            },
            type: "driver-check"
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            coordinate: {
              latitude: driverCoordinate.split(",")[1],
              longitude: driverCoordinate.split(",")[0]
            },
            type: "driver-check"
          })
        );
      }
    } else if (obj.type === "driver-routing") {
      const { start, end } = obj;
      const route = await getDrivingPath(
        `${start.longitude},${start.latitude}`,
        `${end.longitude},${end.longitude}`
      );
      ws.send(
        JSON.stringify({
          route,
          type: "driver-routing"
        })
      );
    }
  });
  ws.on("open", async () => {
    // push driver coordinates and route path to user's side
  });

  // setInterval(async () => {
  //   const routeValue = await client.get("route-path");
  //   const points = await client.get("route-points");
  //   if (!routeValue) {
  //     logger.error("route path is not fetched");
  //   }
  //   if (!points) {
  //     await simulateCarDrivingByPoints(
  //       JSON.parse(routeValue).polyline[0].points
  //     );
  //   } else {
  //     await simulateCarDrivingByPoints(JSON.parse(points));
  //   }

  //   // await client.set("route-path",JSON.stringify(routeValue));
  //   const value = await client.get("driver-current-coordinate");
  //   console.log("driver-current-coordinate", value);
  //   if (routeValue) {
  //     ws.send(
  //       JSON.stringify({ driver: value, route: JSON.stringify(routeValue) })
  //     );
  //   }
  // }, 500);
});

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
