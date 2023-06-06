const express = require("express")
const routeFrontEnd = express.Router()
const { rateLimit } = require("express-rate-limit")
const { readdirSync } = require("fs")
const { frontEndRateLimit } = require("../../assets/rateLimit.json")

const limiter = rateLimit({
	windowMs: frontEndRateLimit.windowMinutes * 60000,
	max: frontEndRateLimit.maxWindowRequest,
	standardHeaders: frontEndRateLimit.standardHeaders,
	legacyHeaders: frontEndRateLimit.legacyHeaders,
	message: frontEndRateLimit.message
})

routeFrontEnd.use(limiter)

const loadFrontEndFile = readdirSync("./src/frontEnd/pageLoader").filter(files => files.endsWith(".js"))
for(const file of loadFrontEndFile) {
	const { execute, name } = require(`../frontEnd/pageLoader/${file}`)
	routeFrontEnd.get(`/${name}`, async (req, res) => {
		execute(req, res)
	})
}

module.exports = routeFrontEnd
