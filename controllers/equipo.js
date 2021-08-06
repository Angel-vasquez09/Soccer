const { response } = require("express")
const   Equipo = require("../models/equipo");


// OBTENER TODOS LOS EQUIPOS
const getEquipos = async(req,res = response) => {

    
    try {
        
        const equipos = await Equipo.findAll();
        
        return res.json({
            equipos
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}

// OBTENER EQUIPO POR ID
const getEquipo = async(req, res = response) => {

    const { id } = req.params;
    
    try {
        
        const equipo = await Equipo.findOne({where: { id }});
        return res.json({
            equipo
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}


// ACTUALIAR EQUIPO POR ID
const updateEquipo = async(req, res = response) => {

    const { id   } = req.params;
    const { body } = req;

    try {

        const equipo = await Equipo.findByPk( id );

        if (!equipo) {
            return res.status(400).json({
                msj: `El id ${id} no existe en la base de datos`
            })
        }

    
        const actualizado = await equipo.update( body );
        
        res.json({
            ok: true,
            msj: 'Equipo actualizado correctamente',
            actualizado
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}


// AGRAGAR UN NUEVO EQUIPO
const addEquipo = async(req,res = response) => {
    
    const { body } =  req;

    try {

        const equipo = await Equipo.create(body);

        return res.json({
            equipo
        })

    } catch (error) {
        throw new Error("Error: => " + error);
    }
}

// ELIMINAR EQUIPO

const deleteEquipo = async(req, res = response) => {

    const { id } = req.params;
    
    try {
        await Equipo.destroy({ where: { id }});

        res.json({
            ok: true
        })

    } catch (error) {
        throw new Error("Error al eliminar un futbolista " , error);
    }
}


module.exports = {
    getEquipos,
    getEquipo,
    updateEquipo,
    addEquipo,
    deleteEquipo
}
