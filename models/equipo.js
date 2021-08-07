const  { DataTypes } = require('sequelize');
const    db          = require("../db/conexion");
const Futbolista = require('./futbolista');

const Equipo = db.define("equipo", {

    nombre: {
        type: DataTypes.STRING
    },
    league: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    }
})



module.exports = Equipo;