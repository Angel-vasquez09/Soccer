const  { Sequelize } = require("sequelize");


const bd =  new Sequelize('soccer', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});


module.exports = bd;
