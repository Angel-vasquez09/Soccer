
const express = require( "express");
const  cors   = require( "cors");
const  db    = require( "../db/conexion");

class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;

        //BASE DE DATOS
        this.dbConnection();

        this.middlewere();

        this.routes();

    }


    middlewere(){

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));

    }

    async dbConnection()
    {
        try {
            await db.authenticate();
            //require("./relaciones");
            console.log("Base de datos online");
        } catch (error) {
            throw new Error('Error en la base de datos ' + error);
        }
    }


    routes(){

        this.app.use('/auth',       require('../routes/admin'));

        this.app.use('/futbolista', require('../routes/futbolista'));

        this.app.use('/equipo',     require('../routes/equipo'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("Servidor Corriendo en el puerto " + this.port);
        })
    }
}


module.exports = Server;