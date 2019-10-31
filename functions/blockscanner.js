const steem = require("steem")
const blockfilter = require("./blockfilter.js")
const configfile = require("../config.js").configurationFile
let counter = 0;
let startingBlock = configfile.startingBlock
let latestblock = 0;

function stramblocknumber(){//streams block number, tries again if loses connection
  steem.api.streamBlockNumber(function(err, result) {
    if(err){stramblocknumber();console.log("error streaming block")}
    if(result){
      if(startingBlock === 0){startingBlock = result}
      checkblockorder(result)
      latestblock = result
      module.exports = {latestblock}
     }
  })
}

function checkblockorder(blocknum){//checks that the blocks are in order
  if(configfile.startingBlock === 0){configfile.startingBlock = blocknum}
  theoryBlock = configfile.startingBlock + counter
  if(theoryBlock === blocknum){
    getBlockNumber(theoryBlock);
    counter++;
    return;}
  if(theoryBlock < blocknum){
    getBlockNumber(theoryBlock);
	counter++;
	checkblockorder(blocknum);
	return;}
}

function getBlockNumber(blockNumber){
	//console.log(blockNumber)
	miObj = {};
     steem.api.getBlock(blockNumber, function(err, result) {
	  if(err){getBlockNumber(blockNumber);
	  	console.log("failed to get block, trying again")}
	  if(result){
	  //	console.log(result)
        miObj.blockNumber = blockNumber
        miObj.blockContents = result
        blockfilter(miObj);
        module.exports = {counter, startingBlock}
	  }
  });
}

function eachblocktrigger(){

}
module.exports = stramblocknumber