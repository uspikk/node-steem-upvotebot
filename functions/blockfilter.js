let lastCheckedBlocknumber = 0;
let counter = 0;
let allblockNumbers = [];
let failsafecounter = 0
let warningMessages = require("../config.js").warningMessages
let postncomments = require("./postcommentssorter.js").postncomments
let upvotelistsorter = require("./upvotesorter.js").sorttrailvotes

function blockfilter(block){
 if(lastCheckedBlocknumber === 0){lastCheckedBlocknumber = block.blockNumber}
 for(var i=0;i<block.blockContents.transactions.length;i++){
 	if(block.blockContents.transactions[i].operations[0][0] === "comment"){
 		block.blockContents.transactions[i].operations[0][1].blocknum = block.blockNumber;
 		postncomments(block.blockContents.transactions[i].operations[0][1]);
 		}
 	if(block.blockContents.transactions[i].operations[0][0] === "vote"){
 		block.blockContents.transactions[i].operations[0][1].blocknum = block.blockNumber;
 		upvotelistsorter(block.blockContents.transactions[i].operations[0][1]);
 	}
 };
 checkfilteredblocks(block.blockNumber);
 allblockNumbers.push(block.blockNumber);
 checkforAllblocks();
};

function checkfilteredblocks(blocknum){
	let chekingTheOne = blocknum - lastCheckedBlocknumber
	if(lastCheckedBlocknumber === blocknum){return;}
	if(chekingTheOne === 1){lastCheckedBlocknumber = blocknum;return;}
		else{if(warningMessages.unorderedwarn === true){
			console.log("UNORDERED BLOCKS: " + lastCheckedBlocknumber + " CURRENT BLOCK: " + blocknum)}
	      lastCheckedBlocknumber = blocknum
		}
};


function checkforAllblocks(){
let foundtheblock = false;
let startingblock = require("./blockscanner.js").startingBlock
let theoryBlock = startingblock + counter
if(counter === undefined && startingblock === undefined){return;}
else{if(failsafecounter === 100){console.log("can't find block: " + theoryBlock)}
	for(var i = 0; i<allblockNumbers.length;i++){
		if(foundtheblock === true){continue;}
	    if(allblockNumbers[i] === theoryBlock){counter++
		   allblockNumbers.slice(i, i);
	       foundtheblock = true;
	       failsafecounter = 0;}
		if(i === allblockNumbers.length - 1 && foundtheblock === false){
			if(isNaN(theoryBlock)){continue;}
			failsafecounter++
			console.log("can't find block: " + theoryBlock)
		}
}

}
}

module.exports = blockfilter