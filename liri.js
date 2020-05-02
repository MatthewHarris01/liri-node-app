var FS = require("fs");
require("dotenv").config();
chalk = require("chalk");
var keys = require("./keys.js");

var Verb =""; // global variable for the command to perform
var Item =""; // global variable for the item to search for

//THE FOLLOWING STATEMENT PRODUCES A RUNTIME ERROR, "Spotify is not defined."
// var spotify = new Spotify(keys.Spotify);  //this line may not work until the keys.js file is populated more fully.

// console.log("spotify ID is: [" + keys.spotify.id + "]");

// console.log("spotify secret is [" + keys.spotify.secret + "]");

var cmdList= ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "help"];


//liri exptects 2 arguments for all but one command, therefore if the total count of arguments is greater than 4, it is a fatal error
var cmdCount = process.argv.length;
var cmdIn = process.argv.slice(2);
console.log("count of args after slice: " + cmdIn.length);

//check for too few arguments -- NOTE: IF THE COMMAND IS "SPOTIFY-THIS" and there is no song argument, then default to "The Sign" by Ace of Base

if (cmdIn.length == 1){
  let s = cmdIn[0].toLowerCase();
  //do we need to set the default for 'spotify-this'?
  if (s == "spotify-this-song") {
    //yes, set default values
    console.log(chalk.yellow.bold("NEED TO SET SPOTIFY DEFAULT"));
    SetSpotifyDefaults();
  }

  //do we need to read the text file to get default command and item?


  if (s != "do-what-it-says" && s != "help" && s != "spotify-this-song") {
    BadArgumentsMsg("ERROR!! except for the commands \'do-what-it-says\' and \'help\' Liri expects at least 2 arguments! Please try again!");
  return;
}
}

// console.log(chalk.yellow.bold("command arguments: " + cmdIn));
// console.log("");

// check whether there are too many arguments
if (cmdIn.length > 2) {
  BadArgumentsMsg("ERROR!! Liri-bot expects not more than 2 arguments in the command line, please try again!!");
  return;
 }

 //if we get here, the arguments are not too many or too few.
 ParseArguments(); //call function to parse out command and search item.
 console.log(chalk.yellow.bold("Verb is: " + Verb));
 console.log(chalk.yellow.bold("Item is: " + Item))

// console.log("count of process args: " + process.argv.length);
function ParseArguments() {
var searchname = process.argv.slice(2);
process.argv.slice(2);

// console.log("searchname after slice: [" + searchname + "]");
// console.log("argv after slice: [" + process.argv + "]");

// console.log("length of searchname: " + searchname.length);

for (i=0; i < cmdIn.length; i++) {
  console.log("loop count: " + i); 
  if (i==0) {
    Verb = searchname[i];
  }
  else {
    Item = searchname[i];
  }
  console.log("argument: " + searchname[i]);
}

console.log("command verb: " + Verb);
console.log("item to act on: " + Item);

executeCommand(Verb,Item);
console.log("command verb: " + Verb);
console.log("item to act on: " + Item);
}


function executeCommand(cmd,item) {
  //this function determinse whether the command is valid, and executes the corresponding API call to get information.
  //for reference only:  var cmdList= ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", :"help"];

  cmd = cmd.toLowerCase(); //ensure the command parsing is not case-sensitive.
    switch (cmd) {
      case "concert-this":
        console.log(chalk.yellow.bold("search bands in town for: " + item));
        SearchBandsInTown(item);
        break;
      case "spotify-this-song":
        console.log(chalk.yellow.bold("search spotify for: " + item));
        SearchSpotify(item);
        break;
      case "movie-this":
        console.log(chalk.yellow.bold("search omdb for: " + item));
        SearchOMDB(item);
        break;
      case "do-what-it-says":
        console.log(chalk.yellow.bold("do the spotify search in the random.txt file"));
        ReadFromFile();
        SearchSpotify(item);
        break;
      case "help":
        UserHelp();
        // console.log(chalk.yellow.bold("show the command help"));
        break;
      default:
        BadArgumentsMsg("ERROR!! unknown command! Please try again!");
        // console.log(chalk.yellow.bold("Liri only recognizes these commands: " + cmdList));
    }
}

function UserHelp() {
  //this function display help to the user.
  console.log(chalk.red.bold("**LIRI HELP**"));
  console.log("");
  console.log(chalk.blue.bold("Liri recognizes the following 5 commands:"));
  for (let i =0; i < cmdList.length; i++) {
    console.log(chalk.blue.bold("     " + cmdList[i]));
  }
  console.log(chalk.yellow.bold("To use Liri, you must enter one of the 5 commands listed above, with the command followed by the name of a song, movie, or artist enclosed in quotation marks, as shown in the line below:"));
  console.log(chalk.yellow.bold("Only the \'do-what-this-says\' and \'help\' commands do not require a 2nd argument."));
  console.log(chalk.blue.bold("node liri <command> \'song title or movie name or performing artist\'"));
  console.log("");
  console.log(chalk.blue.bold("For example, to find upcoming concert listings for the band \"Death Cab for Cutie\" from \"Bands In Town\" you would use the  command-line shown below:"));
  console.log(chalk.green.bold("node liri concert-this \'Death Cab for Cutie\'"));
  console.log("");
  
  console.log(chalk.blue.bold("the \'concert-this\' command causes Liri to search Bands in Town for upcoming shows by a performing artist or group that you specify"));
  console.log(chalk.blue.bold("The \'spotify-this-song\' command causes Liri to search Spotify for a song that you specify"));
  console.log(chalk.blue.bold("The \'movie-this\' command causes Liri to search OMDB to get information about a movie that you specify."));
  console.log(chalk.blue.bold("The \'do-what-it-says\' command causes Liri to read a command and name from a file named \'random.txt\' and execute the command for the name from the file. By default the file is set to search spotify for the song \"I want it that way\""));
  console.log(chalk.blue.bold("The \'help\' command displays this help"));
 
}

function BadArgumentsMsg(msg) {
  console.log(chalk.red.bold(msg));
  console.log(chalk.yellow.bold("The commands that Liri-bot accepts are: " + cmdList.join(", ")));
  console.log(chalk.yellow.bold("To use Liri, you must enter a command followed by the name of a song, movie, or artist enclosed in quotation marks, as shown in the line below:"));
  console.log(chalk.blue.bold("node liri <command> \'song title or movie name or performing artist\'"));
  console.log("");
  console.log(chalk.blue.bold("For example, to find upcoming concert listings for the band \"Guns and Roses\" from \"Bands In Town\" you would use the  command-line shown below:"));
   console.log(chalk.green.bold("node liri concert-this \'Death Cab for Cute\'"));
   console.log("");
   console.log(chalk.yellow.bold("run Liri with the command Help to get information about what each Liri command does."));
   console.log("");
   console.log(chalk.green.bold("run 'node liri help\' to get more help using Liri."));
}

function SetSpotifyDefaults() {
  // this function sets the default values for when the command is 'spotify-this' and no song argument is supplied
  console.log(chalk.yellow.bold("SETTING SPOTIFY DEFAULT"));
  Verb = "spotify-this-song";
  Item = "The Sign";
}

function ReadFromFile() {
  let inputArray = [];
  console.log(chalk.yellow.bold("READ THE TEXT FILE TO GET COMMAND AND ITEM"));

FS.readFile("random.txt", "utf8", function(error,data) {
  if (error) {
    return console.log(error);
  }
  console.log(chalk.blue.bold("[" + data + "]"));
  data = data.replace(/\n/g,"");  //get rid of LF char
  data = data.replace(/\r/g,"");  //get rid of CR


  inputArray = data.split(",");
  console.log(chalk.yellow.bold("length of input array: " + inputArray.length));

  //assume that the input array has 2 elements and element 0 is the verb, and element 1 is the item.
  Verb = inputArray[0];
  Item = inputArray[1]  //.rep
  // let s = inputArray[1].replace(/\r/,"");
  // Item = s;
  // Item=Item.replace(/\r/g,"");

  console.log(chalk.blue.bold("Verb is: [" + Verb + "]"));
  console.log(chalk.blue.bold("item is: [" + Item + "]"));
})

}

function SearchSpotify(verb,item) {
  // this function searches spotify for the specified item.
  console.log(chalk.yellow.bold("FUNCTION TO SEARCH SPOTIFY FOR: " + Item));

}

function SearchBandsInTown(item) {
  //THIS function searches bands in town for the specified item.
  console.log(chalk.yellow.bold("FUNCTION TO SEARCH BANDS IN TOWN FOR: " + item));
  

}

function SearchOMDB(item) {
  console.log(chalk.yellow.bold("FUNCTION TO SEARCH OMDB FOR: " + item));


}