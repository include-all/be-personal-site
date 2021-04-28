# be-personal-site

be-personal-site

## Introduction

1. 需要在/config 中创建 db_secret.js 文件，去配置数据库账密

```javascript
const db_mysql = {
  username: "{对应的username}", // 用户名
  password: "{对应的password}", // 口令
  host: "{对应的host}", // 主机名
  port: "{对应的port}", // 端口号，MySQL默认3306
};

module.exports = {
  db_mysql,
};
```

2. 提供了简单的 jwt 登录认证，日志等功能
3. 布上服务器需要先在服务器安装 pm2

## Description

个人站点的后端项目，爬取虎扑，nga帖子数据，以及利用公开api，获取微博热搜，知乎热榜，观察者网的最新文章等信息
