const  { Sequelize } = require("sequelize");


const bd =  new Sequelize('bm1a6xaehacurupliaye', 'uzezl6whmeqok70y', '46MmMGUMzXidCJUHdgDT', {
    host: 'bm1a6xaehacurupliaye-mysql.services.clever-cloud.com',
    dialect: 'mariadb'
});


module.exports = bd;
