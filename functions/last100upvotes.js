const sendtovote = require("./txbuilder.js").buildupvoteforfollow


let permlinks = []
function storepermlink(permlink){
 permlinks.push(permlink);
}

function checkpermlink(txops){if(permlinks.length > 100){deletepermlink();};
 for(var i = 0;i<permlinks.length;i++){if(txops.permlink === permlinks[i]){
 	console.log("already voted on : " + txops.author);return;}};
 sendtovote(txops);
};

function deletepermlink(){
 permlinks.shift();
};

module.exports = {storepermlink, checkpermlink}