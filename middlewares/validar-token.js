const { response } = require('express');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');


const validarToken = async(req,res = response,next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: "No enviaron ningun token"
        })
    }
    

    try {

        // verificamos si es un token valido
        const { uid: id } = jwt.verify(token,process.env.SECRETOPRIVATEKEY);

        // Verificamos si el id esta en la base de datos
        const admin = await Admin.findOne({where : { id } });

        // Verificamos si el usuario existe
        if (!admin) {
            return res.status(401).json({
                msg: "El token no es valido - el usuario no existe en la base de datos"
            })
        }

        // Si el token es valido guardamos los datos del usuario
        req.adm = admin;

        next();

    } catch (error) {
        res.status(401).json({
            msg: "Token no valido" + error
        })
        
    }


}

module.exports = {
    validarToken
}