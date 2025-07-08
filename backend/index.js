const express = require('express')
const cors = require('cors')
const app = express()
const userRouter = require("./routers/userRoutes")
const typeRouter = require("./routers/typeRoutes")
const marcheRouter = require("./routers/marcheRoutes")
const fournisseurRouter = require("./routers/fournisseurRoutes")
const articleMarcheRouter = require("./routers/articleMarcheRoutes")
const articleLivreRouter = require("./routers/articleLivreRoutes")
const entiteAdminRouter = require("./routers/entiteAdminRoutes")
const affectationRouter = require("./routers/affectationRoutes")
const entiteLogRouter = require("./routers/entiteLogRoutes")
const generateRouter = require('./routers/generateDocRoute')
const statsRouter = require('./routers/statsRoutes')
const authRouter = require('./routers/authRoutes')
const {verifyAccessToken} = require('./middleware/verifyAccessToken')
const {verifyAdmin} = require('./middleware/verifyAdmin')
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5500


app.use(cookieParser());
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use('/auth',authRouter)
app.use(verifyAccessToken)
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
app.use(verifyAdmin)
app.use('/user',userRouter)







app.listen(PORT , ()=>console.log(`Positive on ${PORT}`))