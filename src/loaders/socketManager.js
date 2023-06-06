const { readdirSync } = require("fs")
const socket = require("socket.io")
global.io = socket(server)

const loadSocketEventsDirs = readdirSync("./src/socketEvents")
for(dirs of loadSocketEventsDirs) {
	const perSocketEventFile = readdirSync(`./src/socketEvents/${dirs}`).filter(file => file.endsWith(".js"))
	io.on("connection", (socket) => {
		for(file of perSocketEventFile) {
			const { name, execute } = require(`../socketEvents/${dirs}/${file}`)
			socket.on(name, (socketInput) => {
				execute(socketInput, socket, io)
			})
		}
	})
}
