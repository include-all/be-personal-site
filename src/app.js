const Koa = require("koa");
const KoaLogger = require("koa-logger");
const dayjs = require("dayjs");

const bodyParser = require("koa-body");
const KoaJwt = require("koa-jwt");
// 配置
const JWT_SECRET = require('./config/jwt-secret')

// 中间件
const parseToken = require('./middleware/parseToken')
const tokenError = require('./middleware/tokenError')

const router = require('./router/index')

// 定时任务
const scheduleJob = require('./schedule/index')

const app = new Koa();

const logger = KoaLogger((str) => {
  console.log(dayjs().format("YYYY-MM-DD HH:mm:ss") + str);
});

app.use(logger);
// koa-body会自动解析application/json的body
app.use(bodyParser());

app.use(tokenError);
app.use(parseToken);

app.use(
  KoaJwt({ secret: JWT_SECRET }).unless({
    path: [/^\/api\/auth\/login/, /^\/api\/open/, /^\/api\/topList/],
  })
);

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3080;
app.listen(port, () => {
  console.log(`success start server`);
  console.log(`local: http://127.0.0.1:${port}`);
});

// 定时任务
scheduleJob.hupuJob()
scheduleJob.ngaJob()