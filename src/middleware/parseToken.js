// 从cookie中解析出token,放在koa-jwt的要求格式中
const parseToken = async (ctx, next) => {
  const cookie = ctx.request.header.cookie || "";
  const tokenCookie = cookie.split(";").filter((item) => {
    return item.startsWith("app_token");
  })[0];
  if (tokenCookie) {
    const token = tokenCookie.split("=")[1];
    ctx.request.header = { authorization: "Bearer " + (token || "") };
    ctx.app_token = token;
  }
  await next();
};

module.exports = parseToken;
