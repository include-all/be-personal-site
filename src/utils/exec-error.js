module.exports = (ctx, e) => {
  console.log(e)
  ctx.status = 500
  ctx = {
    errMsg: 'e'
  }
}