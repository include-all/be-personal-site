const axios = require('axios')
const iconv = require('iconv-lite');

const open = {
  async hello(ctx) {
    try {
      const res = await axios.get('http://hq.sinajs.cn/list=sh601006', {
        responseType: 'arraybuffer'
      })
      // 转义数据
      const data = iconv.decode(Buffer.from(res.data), 'gbk');
      ctx.body = {
        data: {
          msg: data
        },
      };
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = open
