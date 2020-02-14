require("dotenv").config();
var keys = require("./keys.js");

var spotify = new spotify(keys.spotify);  //this line may not work until the keys.js file is populated more fully.