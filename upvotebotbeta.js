let steem = require("steem");
let fs = require("fs");
let voter = "";
let wif = "";
let weight = 1000;
let delay = 2000;


setInterval(saveFollowers, 4000);
getfollowers();//gets the followers from a file
blockscanner();//starts blockscanner
//getBlock(36960418);//starts getBlock function to get block contents needs to have a input of the block number
//setInterval(filteringContent, 10000);



function blockscanner(){//function to stream the latest block number
	steem.api.streamBlockNumber(function(err1, newestblock) {//api call to stream the latest block number
//		console.log(err1, newestblock);//logs the result of the api call
		if(newestblock === undefined || newestblock === null){
	//		console.log("timed out")
			blockscanner();
			return;
		}
		else{
         getBlock(newestblock);//passes the block to getBlock function
         //console.log("upvote Queue: " + upVoteQueue.length);
         upVote(newestblock);
     }
});
};

function getBlock(blockNum){//function to get the data from the block number
	steem.api.getBlock(blockNum, function(err, result) {//api call to get the block contents
      //console.log(err, result);//logs the result of the api call
      filterContents(result.transactions, blockNum);//sends the transactions to the filterContents function along with the head block
});
};

let contentToGetFiltered = [];//this array contains the content that needs filtering
function filterContents(transActions, currentBlock){//function to filter the transactions by comment type, also takes current block to add block tag to the array on previous line
    //console.log(transActions); //logs the content we're getting
    var thisNeedsFiltering = {  ////creates a template to push to the contentToGetFiltered array
          "author" : "",
          "url" : "",
          "block": ""
    };
    for (var i = 0; i<transActions.length; i++){//for loop to check each transaction individually to sort it
    	//console.log(transActions[i].operations);
    	if(i===0 && transActions[i].operations[0][0] !== "comment"){//this is funky
    	  thisNeedsFiltering = {  //resets the object each round
          "author" : "",
          "url" : "",
          "block": ""
    };
    	}  	
    	if(transActions[i].operations[0][0] === "comment" && transActions[i].operations[0][1].title !== ""){//if the transaction is a comment and has a title it gets pushed to content to get filtered array
    		thisNeedsFiltering.author = transActions[i].operations[0][1].author;//adds the author
    		thisNeedsFiltering.url = transActions[i].operations[0][1].permlink;//adds the url
    		thisNeedsFiltering.block = currentBlock;//adds the current block
    		contentToGetFiltered.push(thisNeedsFiltering);//pushes to contentToGetFiltered array
    		filteringContent();
           // console.log(JSON.stringify(contentToGetFiltered));//console log for testing purposes
    	};//end if statement
    };//end for loop
};//end function

let listFollowing;//takes the data from the following function
function getfollowers(){ // this function gets the followers from a file
       fs.readFile('following.txt', "utf8", (err, data) => { //reads from file
           if (err) throw err;//if it can't find a file it throws a error
             //console.log(data)
           listFollowing = JSON.parse(data)//assigns the data to listfollowing variable
          // console.log(listFollowing[0])
});//end readfile
};//end function

let upVoteQueue = [];//creates a upvote queue
function filteringContent(){//second layer at filtering content it looks for if the contentToGetFiltered author mactches to anyone on our list
   for(var i = 0; i<listFollowing.length;i++){
   	if(contentToGetFiltered.length === 0){
   //		console.log("nothing to filter");
   		return;
   	}
    // console.log(listFollowing[i])
    if(listFollowing[i] === contentToGetFiltered[0].author){
     // console.log("checking if " + contentToGetFiltered[0].author + " matches " + listFollowing[i]);
     console.log("found match");
     upVoteQueue.push(contentToGetFiltered[0]);
    };
    
    if(i === listFollowing.length - 1){
    //	console.log("got to " + listFollowing[i] + " this post does not belong here");
   // 	console.log("Shifting post" + JSON.stringify(contentToGetFiltered[0]));
    	contentToGetFiltered.shift();
    };
    };
};//end function


function upVote(curBlok){
	if (upVoteQueue === undefined || upVoteQueue.length == 0) {
 //   console.log("no posts to upvote")
    return;
}
	if(curBlok - upVoteQueue[0].block > delay ){
		//console.log(curBlock - upVoteQueue[0].block)
		console.log("Upvoting...")
         steem.broadcast.vote(wif, voter, upVoteQueue[0].author, upVoteQueue[0].url, weight, function(err, result) {
          console.log(err, result);
          if(err){
          	console.log(err)
          	return
          }
          if(result){
          	upVoteQueue[0].shift();
          	return
          }
           });
	}
    if(curBlock - upVoteQueue[0].block < delay){
    	console.log("another x blocks for next upvote" )
    	return;
    }

}


let startFollowing = "";
let followType = "";
limitF = 1000;
function saveFollowers(){
    steem.api.getFollowing(voter, startFollowing, followType, limitF, function(err, result) {
   // console.log(err, result);
  //    console.log("Attempting to save followers")
for(var i=0; i<result.length; i++) {
  if(i === 0){
  //  console.log("emtying the array.")
    followingPeople = [];
}
    followingPeople.push(result[i].following);
//    console.log("pushed  " + result[i].following);
  if(i === result.length - 1){
    fs.writeFile('following.txt', JSON.stringify(followingPeople), function (err) {
  if (err) throw err;
 // console.log('Saved!');
});
  }
}
});
}












