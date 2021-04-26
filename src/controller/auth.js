const jsonwebtoken = require("jsonwebtoken")
const JWT_SECRET = require("../config/jwt-secret")
const User = require("../model/user")

// interface UserInfo {
//   id?: number;
//   username: string;
//   password: string;
// }

class Auth {
  async login(ctx) {
    const loginInfo = ctx.request.body;
    console.log(loginInfo);

    try {
      const userInfo = await User.getUserLoginInfo(loginInfo.username)
      console.log(userInfo)

      // 用户不存在
      if (!userInfo) {
        ctx.body = {
          errCode: 1003,
          errMsg: "该用户不存在",
        };
        return;
      }

      // 密码错误
      if (loginInfo.password !== userInfo.password) {
        ctx.body = {
          errCode: 1004,
          errMsg: "密码错误",
        };
        return;
      }

      const token = jsonwebtoken.sign(
        // payload
        {
          username: loginInfo.username,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1h
        },
        JWT_SECRET
      );
      ctx.cookies.set("app_token", token, {
        maxAge: 60 * 60 * 1000,
        overwrite: true,
        httpOnly: false,
      });
      ctx.body = {
        success: true,
        token,
      };
    } catch (err) {
      console.log(err)
    }
  }

  async testLogin(ctx) {
    // 经过koa-jwt后，会将payload放在crx.state.user中
    ctx.body = { data: ctx.state.user };
  }
}

module.exports = new Auth();
