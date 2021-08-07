const  { DataTypes } = require('sequelize');
const    db          = require("../db/conexion");
const    Equipo      = require("./equipo");

const Futbolista = db.define("futbolista", {

    name: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.NUMBER
    },
    team_id: {
        type: DataTypes.NUMBER,
    },
    squad_number: {
        type: DataTypes.NUMBER
    },
    position: {
        type: DataTypes.STRING
    },
    nationality: {
        type: DataTypes.STRING
    }
})

Futbolista.belongsTo(Equipo, { targetKey: 'id', foreignKey: 'team_id' });

module.exports = Futbolista;