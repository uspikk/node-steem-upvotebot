//devrelease should include changes in:
//mainaccount
//mainwif
//altaccs


//
//½½½above and below needs to be true½½½
//


const configurationFile ={
	"steemMainAccount" : "estonia",
	"steemMainWif" : "",
	"voteWeight" : 10000,
	"votedelay": 1000, //delay in voting in ms
	"startingBlock" : 0, //leave 0 if no need for a replay
	"upvotefollowing": false, //upvotes the people main account follows
	"upvotecomments":true, //upvotes the comments of main follows
	"upvotetrail" : true  //trail upvotes after main account
}

const commands ={



}

const warningMessages = {
	"unorderedwarn" : false //warns when blocksorter recieves blocks that are not in order
}

module.exports = {configurationFile, warningMessages, commands}
