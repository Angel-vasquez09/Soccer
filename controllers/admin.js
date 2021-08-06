const { response } = require("express");
const Admin        = require("../models/admin");
const { generarToken } = require("../helpers/generar-token");


const auth = async(req, res = response) => {

    const { email, pass } = req.body;

    try {
        
        const admin = await Admin.findOne({ where: { email } });
        
        if(!admin){
            return res.json({
                msg: "Correo / password son incorrectos - email"
            })
        }

        if(admin.pass !== pass){
            return res.json({
                msg: "Correo / password son incorrectos - pass"
            })
        }

        // Generar el JWT
        const token = await generarToken(admin.id);

        return res.json({
            admin,
            token
        })


    } catch (error) {
        console.log("Error al autenticar ", error)
    }

}

const renovarToken = async(req, res = response) => {

    const admin = req.adm;

    const token = await generarToken(admin.id);

    res.json({
        admin,
        token
    })
}


module.exports = {
    auth,
    renovarToken
}