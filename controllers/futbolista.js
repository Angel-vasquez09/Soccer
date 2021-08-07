const { response } = require("express");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const   Futbolista = require("../models/futbolista");
const   Equipo = require("../models/equipo");


// OBTENER TODOS LOS FUTBOLISTAS
const getFutbolistas = async(req,res = response) => {

    const futbolistas = await Futbolista.findAll({include: 'equipo'});

    try {

        return res.json({
            futbolistas
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}

// OBTENER FUTBOLISTA POR ID
const getFutbolista = async(req, res = response) => {

    const { id } = req.params;
    
    try {
        
        const futbolista = await Futbolista.findOne({include: 'equipo',where: { id }});
        return res.json({
            futbolista
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}


// ACTUALIAR FUTBOLISTA POR ID
const updateFutbolista = async(req, res = response) => {

    const { id   } = req.params;
    const { body } = req;

    try {

        const futbolista = await Futbolista.findByPk( id );

        if (!futbolista) {
            return res.status(400).json({
                msj: `El id ${id} no existe en la base de datos`
            })
        }

    
        const actualizado = await futbolista.update( body );
        
        res.json({
            ok: true,
            msj: 'Futbolista actualizado correctamente',
            actualizado
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}


// AGRAGAR UN NUEVO FUTBOLISTA
const addFutbolista = async(req,res = response) => {
    
    const { body } =  req;

    try {

        const futbolista = await Futbolista.create(body);

        return res.json({
            futbolista
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}

// ELIMINAR FUTBOLISTA

const deleteFutbolista = async(req, res = response) => {
    const { id } = req.params;
    try {
        await Futbolista.destroy({ where: { id }});

        res.json({
            ok: true
        })

    } catch (error) {
        throw new Error("Error al eliminar un futbolista " , error);
    }
}



//  consultas o filtros de jugadores por equipo, posición o país

const consultaPosition = async(req, res = response) => {
    const { nombre } = req.params;

    const { position } = req.query;
    

    try {
        
        const jugadores = await Futbolista.findOne({include: 'equipo', where: 
                {   
                    [Op.and]: [{name: {[Op.like]: '%'+nombre+'%'}}, {position}]
                }
            });

        if(!jugadores){
            return res.json({
                position,
                msg: "No coinciden"
            })
        }

        return res.json({
            jugadores
        })
    } catch (error) {
        
    }
}

// Consultar todos los jugadores de un equipo
const equipoJugadores = async(req, res = response) => {

    const { team_id } = req.params;
    try {
        const equipo = await Futbolista.findAll({where: { team_id }})
        if(equipo){
            res.json({
                equipo
            })
        }
    } catch (error) {
        
    }
}



// Consultar jugador por pais
const playerPais = async(req, res = response) =>{
    const { name }    = req.params;
    const { nationality } = req.query;
    try {
        
        const player = await Futbolista.findOne({ include: "equipo",
                                where: { [Op.and]: [{name: {[Op.like]: '%'+name+'%'}},{ nationality: {[Op.like]: '%'+nationality+'%'} }] }})
        
        if(!player){
            return res.json({
                msg: "No coinciden"
            })
        }

        return res.json({
            player
        })
    } catch (error) {
        console.log(error)
    }
}





// Cosultar jugadores de un equipo
const playerEquipo = async(req, res = response) => {
    const { name } = req.params;
    const { equipo } = req.query;

    try {
        const playerE = await Futbolista.findOne({include: 'equipo', where: { 
            [Op.and]: [{name: {[Op.like]: '%'+name+'%'}}]
        }})

        if(!playerE){
            return res.json({
                msg: "El jugador no existe en la base de datos"
            })
        }

        const nameEquipo = playerE.Equipo.nombre;

        if(nameEquipo !== equipo){
            return res.json({
                msg: "El jugador no existe en el equipo " + equipo
            })
        }
        
        return res.json({
            playerE
        })


    } catch (error) {
        throw new Error("Error ", error);
    }
}

module.exports = {
    getFutbolistas,
    getFutbolista,
    updateFutbolista,
    addFutbolista,
    deleteFutbolista,
    consultaPosition,
    equipoJugadores,
    playerPais,
    playerEquipo
}
