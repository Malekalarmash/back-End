const http = require("http");

const host = 'localhost';
const port = 5500;

// Creating a server 
const server = http.createServer((request, response) => {
    response.statusCode = 200; 
    response.setHeader ("content-type", "text/plain")
    response.end("This is a basic server") 
})

// Callback function is a fucntion that is passed as paramter
server.listen(port, host, ()=> {
    console.log(`server is running on port:${host}:${port}`)
})