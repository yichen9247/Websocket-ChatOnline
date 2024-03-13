# Websocket在线聊天室

这是一个基于Vue3、MySQL和Websocket实时通讯技术以及Element Plus组件库构建的前端网页在线聊天室，旨在使用最少的代码和最简单的逻辑来模拟在线聊天环境。

## 配置项目

请先配置好MySQL数据库，并创建一个的数据库，然后修改server/data.js文件中的数据库连接信息。

```js
module.exports = {
    port: 3306,
    user: 'root',
    host: 'localhost',
    database: 'websocket',
    password: '1234567890'
}
```

如果你不想使用MySQL数据库，也可以将server/data.js文件中的数据库配置改掉，让数据库连接失败，这样就会自动变更为本地JSON存储。

## 运行项目

```sh
npm install
npm run dev
```

## 运行后端

```sh
cd server
npm install
cd ../
npm run server
```

## 运行软件

```sh
cd server
npm install
cd ../
npm run server

npm install
npm run dev

cd electron
npm install
npm run start
```

## 打包项目

```sh
npm run build
```

注意：打包后的项目需要配合后端一起使用，不然会运行失败，建议直接使用开发模式运行，免去打包操作。

## 清理记录

```sh
npm run clear
```

此命令用于清理聊天记录，您的用户信息不会被清理掉，不管是MySQL还是JSON存储，只会清理掉聊天记录。

## 开源说明

本项目作者：Hua（王健铮）

本项目链接：https://github.com/yichen9247/Websocket-ChatOnline

此项目是一个开源项目。此项目使用 EPL v3.0 开源许可。开源许可是具有法律效力的合同，请自觉遵守开源许可，尊重他人劳动。

根据许可，你可以对该项目进行传播、分发、修改以及二次发布，包括个人和商业用途，但我方不鼓励一切商业用途。

您必须给出源码来源，包括作者，项目链接（见上）等，必须使用相同的协议开源。

若此项目的源码作为项目的一部分与你私有的源码一起发布时，你可以使用其它协议，但要声明 EPL 部分的内容并声明此部分继续遵循 EPL 协议。

不是在该项目基础上进行增加、修改的，仅参考源码的，不需要开源，但也仅供学习用途。