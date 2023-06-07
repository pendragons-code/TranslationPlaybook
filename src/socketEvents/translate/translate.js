const axios = require("axios")
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
// .message => ratelimit warning
// .error => translate failure
module.exports = {
	name: "translateRequest",
	async execute(socketInput, socket) {
		let keyCalls = await db.get("keyCalls")
		let finalKey = (keyCalls === null || keyCalls < 450) ? process.env.key1
		: (keyCalls >= 450) ? process.env.key2
		: (keyCalls >= 900) ? process.env.key3
		: (keyCalls >= 1350) ? process.env.key4
		: "OutOfCalls"
		if(finalKey === "OutOfCalls") socket.emit("res", { message: "OutOfCalls" })
		let finalFrom = socketInput.from
		let encodedParams = new URLSearchParams()
		encodedParams.set("q", socketInput.text)
		if(finalFrom === "auto"){
			let detectLangOptions = {
				method: "POST",
				url: "https://google-translate1.p.rapidapi.com/language/translate/v2/detect",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					"Accept-Encoding": "application/gzip",
					"X-RapidAPI-Key": finalKey,
					"X-RapidAPI-Hosy": "google-translate1.p.rapidapi.com"
				},
				data: encodedParams
			}
			try{
				let detectRequestResult = await axios(detectLangOptions)
				if(!detectRequestResult) return socket.emit("res", { error: "ERROR: Please try again later!" })
				await db.add("keyCalls", 1)
				fromFinal = detectRequestResult.data.data.detections[0][0].language
			} catch(error) {
				console.log(`[${new Date()}]: ${error}`)
				return socket.emit("res", { error: "ERROR: Please try again later!" })
			}
		}
		try{
			encodedParams.set("target", socketInput.to)
			encodedParams.set("source", finalFrom)
			const translateOptions = {
				method: "POST",
				url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					"Accept-Encoding": "application/gzip",
					"X-RapidAPI-Key": finalKey,
					"X-RapidAPI-Host": "google-translate1.p.rapidapi.com"
				},
				data: encodedParams,
			}
			let translateRequestResult = await axios(translateOptions)
			if(!translateRequestResult) return socket.emit("res", { error: "This service is currently not available!" })
			await db.add("keyCalls", 1)
			return socket.emit("res", translateRequestResult.data.data.translations[0])
		} catch(error) {
			console.error(`[${new Date()}]: ${error}`)
			return socket.emit("res", { error: "An error occured!" })
		}
	}
}
