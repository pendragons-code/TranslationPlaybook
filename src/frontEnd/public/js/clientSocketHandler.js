const socketClient = io()

const form = document.querySelector("#translate")
const from = document.querySelector("#from")
const to = document.querySelector("#to")
const text = document.querySelector("#text")

form.addEventListener("submit", (event) => {
	event.preventDefault()
	if(from.value.length <= 0 || to.value.length <= 0 || text.value.trim().length <= 0) return alert("invalid values!")
	if(from.value.trim().length > 5000) return alert("You have hit the 5000 character limit!")
	if(to.value === from.value) return alert("Your to cannot be the same as your from!")
	socketClient.emit("translateRequest", { from: from.value, to: to.value, text: text.value.trim() })
})

socketClient.on("res", (response) => {
	if(response.message === "OutOfCalls" || response.message === "rateLimit") return alert("This service is currently not available, please try again later!")
	if(response.error) return alert(response.error)
	alert(response.translatedText)
})
