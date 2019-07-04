const Koa = require("koa");
const fetch = require("node-fetch");
const queryString = require("query-string");
const logger = require("./../utils/logger");
const { getPolyLineByPath } = require("./../utils/path");

const endpoint = "https://restapi.amap.com/v3";
const smart2CardEndpoint = "";
const key = "6c3486d413c87f5e55ed44e00dc3913f";

const getDrivingPath = (origin, destination) => {
  const params = queryString.stringify({
    origin,
    destination,
    output: "JSON",
    key
  });
  return fetch(`${endpoint}/direction/driving?${params}`)
    .then(res => res.json())
    .then(data => {
      const {
        route: { paths }
      } = data;
      const polyLine = getPolyLineByPath(paths[0]);
      return polyLine;
    })
    .catch(err => logger.error(err));
};

const getCoordinatesFromSmart2Card = () =>{
  
}


exports.getDrivingPath = getDrivingPath;
