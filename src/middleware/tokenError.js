const tokenError = async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        errCode: 401,
        errMsg: err.message,
      };
    }
  });
};

module.exports = tokenError;
