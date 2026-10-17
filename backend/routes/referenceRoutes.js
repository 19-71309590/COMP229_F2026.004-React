const express = require('express');
const referenceController = require('../controllers/referenceController');

const router = express.Router();

router.get('/', referenceController.getAllReferences);
router.get('/:id', referenceController.getReferenceById);
router.post('/', referenceController.addReference);
router.put('/:id', referenceController.updateReference);
router.delete('/:id', referenceController.deleteReference);

module.exports = router;