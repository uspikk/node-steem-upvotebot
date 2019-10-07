let steem = require("steem");
let username = "estonia";//your steem username
let wif = "";//your steem posting key
let delay = 100;//delay in blocks
let weight = 10000;

let genesisBlcok = 0;//first of the bunch
let bl0cks = []; // array of blocks 
let latestBlock;// latest and greatest
  function streamLatestBlock(){//function to stream the latest block number
	steem.api.streamBlockNumber(function(err, newestblock) {//api call to stream the latest block number
	 if(err){console.log(err);}
	 if(newestblock === null || newestblock === undefined){streamLatestBlock();console.log("timed out");return;}//if too much requests or internet dissconnects or the rpc node is offline, reboots the script, and tries to run it again
     if(newestblock > 1){//if newestblock is any number
       if(genesisBlcok === 0){genesisBlcok = newestblock;console.log("Starting from block: " + genesisBlcok);}//saves the first block to a variable
      bl0cks.push(newestblock);//push it to bl0cks array
      latestBlock = newestblock;};});};//save it as the most recent block for use in other functions

let countingBlocks = 0;
let bl0cks1 = [];
  function checkIfBlocksAreInOrder(){
   var realValue = genesisBlcok + countingBlocks;
   var amBehind = bl0cks[0] - realValue
     if(bl0cks.length === 0){return;}//if bl0cks array is empty, then return
     if(realValue === bl0cks[0]){bl0cks1.push(bl0cks[0]);bl0cks.shift();countingBlocks++;return;}//if blocks are in order it passes the block to next function
     if(realValue < bl0cks[0]){bl0cks.unshift(realValue);console.log("behind " + amBehind + " blocks, catching up");return;}//if it detects that it has skipped a block, it adds it in front of the queue
     else{console.log("wtf");return;};};//this should never happen


let blockContentArray = []//this gets sent to checkTransActions function
 function getBlockContents(){//gets contents from block organizes it and pushes into an array
  var blockContent = {"blockNumber": 0,"blockTxs": []};//template to push into blockContentArray
   if(bl0cks1.length === 0){/*console.log("no blocks")*/;return;}//return if no blocks to check
   if(bl0cks1.length > 0){steem.api.getBlock(bl0cks1[0], function(err, result) {//if there are any blocks to check looks whats in those blocks
     if(err){console.log("error fetching block contents " + err);}//if there is a error fetching any block, logs error
     if(result){//console.log(result);//if gets a result fetching a block
       blockContent.blockNumber = bl0cks1[0];//assigns the values to blockContent variable
       blockContent.blockTxs = result.transactions
       blockContentArray.push(blockContent)//pushes the assigned values to blockContentArray to get passed onto next function
       bl0cks1.shift();}return;});return;}};//shifts the block so it wouldn't get checked again



let contentToFilter = [];
 function checkTransActions(){
  if(blockContentArray.length === 0){return;}//if it has no blocks to check, returns
  if(blockContentArray.length > 0){for(var i = 0; i<blockContentArray[0].blockTxs.length;i++){//if it has any blocks to check runs loop
    /*This for loop checks for every transaction that can be made in the blockchain,
    if the transaction is not listed here it will return "I dont know what is this:"
    so the transaction could be added in if it is not there yet*/
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "vote"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "custom_json"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "claim_reward_balance"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "transfer"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "comment_options"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "comment"){//if it finds comment
		if(blockContentArray[0].blockTxs[i].operations[0][1].parent_author === ""){//checks if the comment DOESN'T have a parent author
          var content = {};//creates a object to store the content in
           content.blockNr = blockContentArray[0].blockNumber;//assigns the values to the object
           content.tx = blockContentArray[0].blockTxs[i];
           contentToFilter.push(content);//pushes the object for further filtering
		   continue;}else{continue;};}//continues even if it has a parent author
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "transfer_to_vesting"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "delegate_vesting_shares"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "claim_account"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "limit_order_create"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "feed_publish"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "limit_order_cancel"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "witness_set_properties"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "account_update"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "delete_comment"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "create_claimed_account"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "withdraw_vesting"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "account_create"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "update_proposal_votes"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "convert"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "cancel_transfer_from_savings"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "transfer_from_savings"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "transfer_to_savings"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "account_witness_vote"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "request_account_recovery"){continue;}
	if(blockContentArray[0].blockTxs[i].operations[0][0] === "recover_account"){continue;}
	else{console.log("I dunno what is this: " + blockContentArray[0].blockTxs[i].operations[0][0])};}//logs transactions it doesn't know yet
  blockContentArray.shift();return;}//removes the first of the array so it doesn't cycle the same content twice
  else{console.log("wtf2");return;};};//this should never run

let imFollowing = [];//variable to store all the people a user follows
 function getFollowers(){//function to get people user follows
  var voter = username;//creates variables for the api function
  var startFollowing;
  var followType;
  var limit = 1000;
   steem.api.getFollowing(voter, startFollowing, followType, limit, function(err, result) {//api call to get followers for user
    if(err){console.log("could not get followers.");getFollowers();return;}//if it returns error, tries to call it again
    if(result){//if it returns a result
	  var following = [];//creates a temp storage
	  for(var i = 0; i<result.length; i++){following.push(result[i].following);};//for loop to filter out the people
      if(imFollowing !== following){imFollowing = following;console.log("updated follow list.");}}//change storages from local to global
    else{console.log("wtf3")};});return;};//this should never run

let stuffToUpvote = []
 function filterContent(){//checks if any of the authors that we saved matches anyone we follow
  if(contentToFilter.length === 0){return;}//returns if there is no content
  if(contentToFilter.length > 0){//if there is content runs the block of code
   //console.log(contentToFilter[0].tx.operations[0][1])//////////////////////////////////////////////////////
   for(var i = 0; i<imFollowing.length; i++){//for loop to check every author agains our following list
    if(imFollowing[i] === contentToFilter[0].tx.operations[0][1].author){//if it finds a match
	console.log("found post to upvote at block: " + contentToFilter[0].blockNr);//logs console to notify sysadmin
	console.log("post by @" + contentToFilter[0].tx.operations[0][1].author);
	console.log("post title: " + contentToFilter[0].tx.operations[0][1].title);
	stuffToUpvote.push(contentToFilter[0]);//pushes content to a global variable we pass into the upvote function
   continue;};};contentToFilter.shift();}//shifts content if it doesn't find any match
else{console.log("wtf4")}};//this should never run

let upvoteCounter = 0;//this counts how many times bot has tried to upvote a piece of content
 function upVoteContent(){//this function is dedicated to upvoting
  if(stuffToUpvote.length === 0){return;}//if the array doesn't contain anything, returns
  if(upvoteCounter === 3){//if upvotecounter has reached 3 then it removes the content from queue
   console.log("tried 3 times to upvote, removing content from queue");
   stuffToUpvote.shift();upvoteCounter = 0;return;}
  if(stuffToUpvote.length > 0){//if it has any content to upvote, runs this block of code
   if(latestBlock - stuffToUpvote[0].blockNr > delay){//if latestblock - stufftoupvote is bigger than the delay it tries to upvote the content
    steem.broadcast.vote(wif, username, stuffToUpvote[0].tx.operations[0][1].author, stuffToUpvote[0].tx.operations[0][1].permlink, weight, function(err, result) {//api call
    if(err){console.log(err);console.log("trying again");upvoteCounter++;return;}//logs if error tries again
    if(result){console.log(result);upvoteCounter=0;stuffToUpvote.shift();}else{return;};});}
   if(latestBlock - stuffToUpvote[0].blockNr < delay){
    console.log("upvoting in " + Math.abs(latestBlock - stuffToUpvote[0].blockNr - delay) + " blocks");
  return;};}else{console.log("wtf5")};};//this should not run



streamLatestBlock();
getFollowers();
setInterval(checkIfBlocksAreInOrder, 1000);
setInterval(getBlockContents, 1000);
setInterval(checkTransActions, 1000);
setInterval(filterContent, 1000);
setInterval(getFollowers, 100000);
setInterval(upVoteContent, 10000);