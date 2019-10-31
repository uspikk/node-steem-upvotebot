const config = require("../config.js").configurationFile
const check4upvoted = require("./last100upvotes.js").checkpermlink

function passthisafterdelay(txops){setTimeout(check4upvoted, config.votedelay, txops);}

module.exports = {passthisafterdelay}