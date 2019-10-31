const steem = require("steem")
const config = require("../config.js").configurationFile
let followlist = []

function getfollowlist(){
 var follower = config.steemMainAccount
 var startFollowing;
 var followType;
 var limit = 1000;
   steem.api.getFollowing(follower, startFollowing, followType, limit, function(err, result) {
     if(err){getfollowlist();}
     if(result){sortfollowList(result)}
  });
};

function sortfollowList(followarr){
 var newfollowlist = []
  for(var i = 0;i<followarr.length;i++){newfollowlist.push(followarr[i].following)};
 comparefollowlists(newfollowlist);
};

function comparefollowlists(thelist){
 if(followlist.length === 0){followlist = thelist;console.log("Succesfully init follow list.");module.exports = {followlist};return;}
 else{
  for(var i = 0;i<thelist.length;i++){
	if(thelist[i] === followlist[i]){/*console.log("list matches")*/continue;}
	if(thelist[i] !== followlist[i]){console.log("updating follow list");followlist = thelist; module.exports = {followlist};return;}
  }}
};


module.exports = getfollowlist