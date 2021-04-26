# koa-app-template

koa app template

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

2. 提供了简单的 jwt 登录认证，日志等功能，和一个简单的定时任务 demo

3. 布上服务器需要先在服务器安装 pm2

## Description

此项目是一个模板项目，由 cli 生成
