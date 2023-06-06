const express = require("express")
const helmet = require("helmet")
const { join } = require("path")
const http = require("http")
const app = express()

global.server = http.createServer(app)

const frontEnd = require("./frontEnd.js")
require("dotenv").config()
require("./dataBase.js")
require("./socketManager.js")
let port = process.env.port || 3000
if(!port) console.log("Port is empty and will be assumed to be 3000!")

app.use(function(req, res, next){
	res.setHeader("Content-Security-Policy", "frame-ancestors 'self';")
	next()
})

app.use("/", frontEnd)
app.set("view engine", "ejs")
app.set("views", join(__dirname, "../frontEnd/views"))
app.use(express.static(join(__dirname, "../frontEnd/public")))
app.use(function(req, res) {
	res.render("404.ejs")
})

app.use(helmet({
	contentSecurityPolicy: false,
	nosniff: true,
	xssFilter: true,
	hsts: { maxAge: 31536000, includesSubDomiains: true }
}))

server.listen((port), async () => {
	console.log(`Hanging onto dear life at ${process.pid}\nCurrently listening at http://localhost:${port}!`)
})
