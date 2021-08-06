const { Router }         = require('express');
const { getFutbolistas, 
        getFutbolista, 
        updateFutbolista,
        addFutbolista,
        deleteFutbolista,
        consultaPosition,
        equipoJugadores,
        playerPais,
        playerEquipo} = require('../controllers/futbolista');

const router = Router();

// OBTENER TODOS LOS FUTBOLISTAS
router.get("/",    getFutbolistas);

// OBTENER FUTBOLISTA POR ID
router.get("/:id", getFutbolista);

// ACTUALIZAR
router.put("/:id", updateFutbolista);

// AGREGAR NUEVO FUTBOLISTA
router.post("/",   addFutbolista);

// ELIMINAR FUTBOLISTA
router.delete("/:id", deleteFutbolista);

// CONSULTAR JUGADOR POR NOMBRE Y POSICION
router.get("/player/:nombre", consultaPosition);

// CONSULTAR LOS JUGADORES DE UN EQUIPO
router.get("/equipo/:team_id", equipoJugadores);

// CONSULTAR JUGADORES POR PAIS
router.get("/player-nationality/:name", playerPais);

// CONSULTAR JUGADOR POR EQUIPO
router.get("/player-equipo/:name", playerEquipo);


module.exports = router;

