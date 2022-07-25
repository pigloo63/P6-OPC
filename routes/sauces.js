const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const saucesControl = require('../controllers/sauces');
const multer = require('../middlewares/multer-config');

//route pour gérer le like ou dislika d'une sauce
router.post('/:id/like', auth, multer, saucesControl.likeSauce);

router.post('/', auth, multer, saucesControl.createSauce);
  
router.put('/:id', auth, multer, saucesControl.updateSauce);

router.get('/:id', auth, saucesControl.getOneSauce);

router.delete('/:id', auth, saucesControl.deleteSauce);

router.get('/', auth, saucesControl.getAllSauce);

module.exports = router;
  