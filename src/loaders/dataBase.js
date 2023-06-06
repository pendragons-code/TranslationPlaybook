const { QuickDB } = require("quick.db")
global.db = new QuickDB({ filePath: "DataBase/db.sqlite" })
