const altacc =[
    {
	"acc":"nrg",
    "pw":""
},
    {
	"acc":"ubg",
	"pw":""
},
    {
	"acc":"voter",
	"pw":""
},
    {
	"acc":"eestlane",
	"pw":""
}
];


function pwextractor(){
 let pw = [];
	for(var i = 0;i<altacc.length;i++){
		pw.push(altacc[i].pw)
	};
	//console.log(pw)
	return pw;
}
module.exports = {pwextractor, altacc};
