const steem = require("steem");
let pw = require("../altaccs.js").pwextractor
let config = require("../config.js").configurationFile
const upvotedb = require("./last100upvotes.js").storepermlink


function broadcasttrailupvote(txops){
 wifs = pw();
  steem.broadcast.send({
    extensions: [],
    operations: txops
    }, wifs, (err, result) => {
     if(err){console.log("error upvoting trail.")}
     if(result){console.log("upvoted with trail.")}
    }
  );
};


function broadcastfollowupvote(txops, failcount){
	if(failcount < 2){
steem.broadcast.send({
  extensions: [],
  operations: [
    txops
  ]}, [config.steemMainWif], (err, result) => {
 // console.log(err, result);
  if(err){broadcastfollowupvote(txops, failcount + 1);console.log("upvote failed.");}
  if(result){upvotedb(txops[1].permlink);console.log("upvote successful.");}
});
}
}

module.exports = {broadcasttrailupvote, broadcastfollowupvote}