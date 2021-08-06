require("dotenv").config();

const Server = require("./models/servidor");

const server = new Server();

server.listen();