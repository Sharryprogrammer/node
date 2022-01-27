const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homefile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {

    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = tempVal.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = tempVal.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = tempVal.replace("{%location%}", orgVal.name);
    temperature = tempVal.replace("{%country%}", orgVal.sys.country);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=1ef2dcd7e5c171bab25e3d64965bc8c8')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homefile, val)).join("");
                res.write(realTimeData);
                // console.log(chunk);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                console.log('end');
            });
    }
});
server.listen(8000, "127.0.0.1");

// cd weathernody