const express = require('express')
const cors = require('cors')
const multer = require('multer')
const app = express()
const userRouter = require("./routers/user")
const typeRouter = require("./routers/type")
const marcheRouter = require("./routers/marche")
const fournisseurRouter = require("./routers/fournisseur")
const articleMarcheRouter = require("./routers/articleMarche")
const articleLivreRouter = require("./routers/articleLivre")
const entiteAdminRouter = require("./routers/entiteAdmin")
const affectationRouter = require("./routers/affectation")
const entiteLogRouter = require("./routers/entiteLog")
const generateRouter = require('./routers/generate')
const statsRouter = require('./routers/stats')
const {verifyUser} = require('./middleware/VerifyUser')

const PORT = process.env.PORT || 5500



app.use(express.json())
app.use(cors())
app.use('/user',userRouter)
app.use(verifyUser)
app.use('/generate',generateRouter) 
app.use('/stats',statsRouter) 
app.use('/type',typeRouter)
app.use('/fournisseur',fournisseurRouter)
app.use('/marche',marcheRouter)
app.use('/articleMarche',articleMarcheRouter)
app.use('/articleLivre',articleLivreRouter)
app.use('/entiteAdmin',entiteAdminRouter)
app.use('/affectation',affectationRouter)
app.use('/entiteLog',entiteLogRouter)








app.listen(PORT , ()=>console.log(`Positive on ${PORT}`))