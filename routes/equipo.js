const { Router } = require('express');
const { getEquipos,
        getEquipo, 
        updateEquipo, 
        addEquipo, 
        deleteEquipo } = require('../controllers/equipo');

        

const router = Router();

// OBTENER TODOS LOS FUTBOLISTAS
router.get("/",       getEquipos);

// OBTENER FUTBOLISTA POR ID
router.get("/:id",    getEquipo);

// ACTUALIZAR
router.put("/:id",    updateEquipo);

// AGREGAR NUEVO FUTBOLISTA
router.post("/",      addEquipo);

// ELIMINAR FUTBOLISTA
router.delete("/:id", deleteEquipo);


module.exports = router;