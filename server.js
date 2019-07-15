const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const _ = require("koa-route");
const logger = require("log4js").getLogger();
const app = new Koa();
const client = require("./src/db/redisClient");
const ws = require("./src/api/ws");
const { getDrivingPath } = require("./src/api/aMap");

logger.level = "debug";

const coordinates = {
  save: async ctx => {
    const res = ctx.request;
    try {
      const {
        body: { longitude, latitude }
      } = res;
      await client.set(
        "driver-current-coordinate",
        longitude + "," + latitude
      );
      const value = await client.get("driver-current-coordinate");
      ctx.body = { value };
    } catch (err) {
      ctx.body = { error: err };
      logger.error(err);
    }
  },
  saveStartEndCoordinates: async ctx => {
    const { request } = ctx;
    const { start, end } = request.body;
    logger.info('save start, end coordinate successfully');
    await client.set('start-end',JSON.stringify({start,end}));
    ctx.body = {message: "save successfully"}
  },
  getDrivingRoute: async ctx => {
    const origin = "121.42479,31.220539";
    const destination = "121.50192,31.30227";
    const path = await getDrivingPath(origin, destination);
    await client.set("route-path", JSON.stringify(path));
    ctx.body = path;
  }
};
app.use(bodyParser());
app.use(json());
app.use(_.post("/coordinates", coordinates.save));
app.use(_.get("/route", coordinates.getDrivingRoute));
app.use(_.post("/start-end", coordinates.saveStartEndCoordinates));

app.on("error", (err, ctx) => {
  logger.error("server error", err, ctx);
});

app.listen(3000);
