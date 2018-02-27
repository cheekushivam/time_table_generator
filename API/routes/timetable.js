const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'bro'
  });
});
router.post('/', (req, res, next) => {
  res.status(404).json({
    message: 'No Functionality for this method defined'
  });
});

module.exports = router;
