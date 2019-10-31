let mainconf = require("../config.js").configurationFile
const preupvotecheck = require("./checkfordelay.js").passthisafterdelay


function postncomments(txops){
if(mainconf.upvotefollowing === true || mainconf.upvotecomments === true){upvotefollowtrail(txops)}
}

function upvotefollowtrail(txops){
let followlist = require("./followlistgrabber.js").followlist
if(followlist.length > 0){
    for(var i = 0;i<followlist.length;i++){
        if(txops.author === followlist[i]){
            if(txops.parent_author !== "" && txops.title === ""){
                if(mainconf.upvotecomments === true){
                    console.log("Got a comment to upvote on.");
                    preupvotecheck(txops)
                    continue;
                }
            }
            if(txops.parent_author === "" && txops.title !== ""){
                if(mainconf.upvotefollowing === true){
                    console.log("Got a post to upvote on by @" + txops.author);
                    preupvotecheck(txops)
                    continue;
                }
            }
        }
    }
}
}

module.exports = {postncomments}