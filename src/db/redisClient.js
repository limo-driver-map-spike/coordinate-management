const redis = require("async-redis");
const logger = require("./../utils/logger");
const client = redis.createClient();

client.on("connect", function() {
  logger.info("Redis client connected");
});

client.on("error", function(err) {
  logger.error("Something went wrong " + err);
});

module.exports = client;
