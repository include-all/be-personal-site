const Router = require("koa-router")

const Open = require("../controller/open")
const Auth = require("../controller/auth")
const topList = require("../controller/top-list")
const router = new Router();

router.prefix("/api");

// auth,登录权限
router.post("/auth/login", Auth.login);
router.get("/auth/testLogin", Auth.testLogin);

// hello,测试
router.get("/open/hello", Open.hello);

// 获取列表
router.get("/topList/getList", topList.getList)
router.get("/topList/reGetHupuPostList", topList.reGetHupuPostList)
router.get("/topList/reGetNgaPostList", topList.reGetNgaPostList)
router.get("/topList/reGetThirdApiList", topList.reGetThirdApiList)

module.exports = router;
