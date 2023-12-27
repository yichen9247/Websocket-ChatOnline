
const fs = require('fs');
fs.readFile('history.json','utf8',(err,data) => fs.writeFile('history.json',JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\"}"]),(error) => console.log("Clear complete!")));