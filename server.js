const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const _ = require("koa-route");
const logger = require("log4js").getLogger();
const app = new Koa();
const client = require("./src/db/redisClient");
const { getDrivingPath } = require("./src/api/aMap");

logger.level = "debug";

const coordinates = {
  save: async ctx => {
    const res = ctx.request;
    try {
      await client.set("driver-current-coordinate", JSON.stringify(res.body));
      const value = await client.get("driver-current-coordinate");
      ctx.body = { value: JSON.parse(value) };
    } catch (err) {
      ctx.body = { error: err };
      logger.error(err);
    }
  },
  get: ctx => {},
  getDriveRoute: async ctx => {
    
  }
};
app.use(bodyParser());
app.use(json());
app.use(_.post("/coordinates", coordinates.save));
app.use(_.get("/route-path"));

app.on("error", (err, ctx) => {
  logger.error("server error", err, ctx);
});

app.listen(3000);
