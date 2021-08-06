const  { DataTypes } = require('sequelize');
const    db          = require("../db/conexion");


const Admin = db.define("Admin", {

    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    pass: {
        type: DataTypes.STRING
    }
})

module.exports = Admin;