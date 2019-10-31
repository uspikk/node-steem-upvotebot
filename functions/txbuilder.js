const mainconf = require("../config.js").configurationFile
const altaccs = require("../altaccs.js").altacc
const broadcasttrail = require("./broadcastops.js").broadcasttrailupvote
const broadcastfollow = require("./broadcastops.js").broadcastfollowupvote

function buildupvotefortrail(txops){
  let ops = [];
   for(var i = 0;i<altaccs.length;i++){
       let txbuild = ['vote', {
                       voter: altaccs[i].acc,
                       author: txops.author,
                       permlink: txops.permlink,
                       weight: mainconf.voteWeight
                     }];
       ops.push(txbuild)
    }
 broadcasttrail(ops);
}

function buildupvoteforfollow(txops){
let txbuild = ['vote', {
                voter: mainconf.steemMainAccount,
                author: txops.author,
                permlink: txops.permlink,
                weight: mainconf.voteWeight
              }];
broadcastfollow(txbuild, 0);
}

module.exports = {buildupvotefortrail, buildupvoteforfollow}