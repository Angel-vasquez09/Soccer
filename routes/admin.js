const { Router } = require('express');
const { auth, renovarToken }   = require('../controllers/admin');
const { validarToken } = require('../middlewares/validar-token');

const router = Router();

router.post("/", auth);

router.get("/", 
    validarToken,
renovarToken);


module.exports = router;
