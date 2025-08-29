const express = require('express')
const router = express.Router()
const generate = require('../utils/generateDoc')

router.route('/')
.post(generate)


module.exports = router