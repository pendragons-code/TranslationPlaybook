const languageList = require("../../../assets/lang.json")
module.exports = {
	name: "/",
	async execute(req, res) {
		let optionsFromTo = ""
		for(const language of languageList){
			optionsFromTo += `\n<option value="${language.code}">${language.name}</option>`
		}
		res.render( "index.ejs", { optionsFromTo })
	}
}
