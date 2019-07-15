const Koa = require("koa");
const fetch = require("node-fetch");
const queryString = require("query-string");
const logger = require("./../utils/logger");
const { getpolylineByPath } = require("./../utils/path");

const endpoint = "https://restapi.amap.com/v3";
const key = "6c3486d413c87f5e55ed44e00dc3913f";

const getDrivingPath = (origin, destination) => {
  const params = queryString.stringify({
    origin,
    destination,
    output: "JSON",
    key
  });
  logger.info(`${endpoint}/direction/driving?${params}`);
  return fetch(`${endpoint}/direction/driving?${params}`)
    .then(res => res.json())
    .then(data => {
      const {
        route: { paths }
      } = data;
      
      const polyline = getpolylineByPath(paths[0]);
      return {
        polyline,
        distance: paths[0].distance,
        duration: paths[0].duration
      };
    })
    .catch(err => {
      logger.error(err);
    });
};

getDrivingPath("116.45925,39.910031", "116.587922,40.081577");

const getCoordinatesFromSmart2Card = () => {};

exports.getDrivingPath = getDrivingPath;
exports.getCoordinatesFromSmart2Card = getCoordinatesFromSmart2Card;
