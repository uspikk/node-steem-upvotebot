const blockscanner = require("./functions/blockscanner.js");
const followthing = require("./functions/followlistgrabber.js");



blockscanner();
followthing();
setInterval(followthing, 60000);
