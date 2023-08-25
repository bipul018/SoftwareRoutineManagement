const express = require('express')
const router = express.Router()



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'BE Routine Homepage' })
  console.log("Homepage requested")
})




module.exports = router