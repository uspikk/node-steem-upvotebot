const mainconf = require("../config.js").configurationFile
const buildtrail = require("./txbuilder.js").buildupvotefortrail

function sorttrailvotes(txops){
if(mainconf.upvotetrail === true){
	if(txops.voter === mainconf.steemMainAccount){
		buildtrail(txops)
	}
}
}


module.exports = {sorttrailvotes}