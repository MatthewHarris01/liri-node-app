var fs = require("fs");
require("dotenv").config();
var chalk = require("chalk");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
// var Spotify = require("spotify");
var input = require("readline-sync");


var Verb =""; // global variable for the command to perform
var Item =""; // global variable for the item to search for
var LogFileName = InitLogFile(); // global variable for the log file path and name.

//****************************************************************** 
//THE FOLLOWING STATEMENT PRODUCES A RUNTIME ERROR, "Spotify is not defined."
// var spotify = new Spotify(keys.spotify);  //this line may not work until the keys.js file is populated more fully.
//****************************************************************** 


var cmdList= ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "help"];


//liri exptects 2 arguments for most commands, therefore if the total count of arguments is greater than 4, it is a fatal error
var cmdCount = process.argv.length;
var cmdIn = process.argv.slice(2);
// console.log("count of args after slice: " + cmdIn.length);

// console.log("CmdIn array length after slicing argv [" +cmdIn.length +"]");

if (cmdIn.length == 0) {
BadArgumentsMsg("ERROR!! too few arguments! Liri expects at least 2 arguments, a search command and a band, movie, or song name enclosed in quotes.");
return; }


//check for too few arguments -- NOTE: IF THE COMMAND IS "SPOTIFY-THIS" or "movie-this" and there is no song or movie argument, 
//then default to "The Sign" by Ace of Base (for spotify) and "Mr. Nobody" (for movie-this)

if (cmdIn.length == 1){
  let s = cmdIn[0].toLowerCase();
  //do we need to set the default for 'spotify-this'?
  if (s == "spotify-this-song") {
    //yes, set default values
    // console.log(chalk.yellow.bold("NEED TO SET SPOTIFY DEFAULT"));
    SetSpotifyDefaults();
  } else if (s == "movie-this") {
    //set hard-coded default for movie-this
    SetMovieDefaults();
  }

    // do-what-it says, help, spotify-this-song, and movie-this are allowed to be without a 2nd argument, as they have hard-coded defaults.
  if (s != "do-what-it-says" && s != "help" && s != "spotify-this-song" && s != 'movie-this') {
    BadArgumentsMsg("ERROR!! except for the commands \'do-what-it-says\',\'help\' and \'movie-this\' Liri expects at least 2 arguments! Please try again!");
  return;
}
}

// check whether there are too many arguments
if (cmdIn.length > 2) {
  BadArgumentsMsg("ERROR!! Liri-bot expects not more than 2 arguments in the command line, please try again!!");
  return;
 }

 //if we get here, the arguments are not too many or too few.
 ParseArguments(); //call function to parse out command and search item.
//  console.log(chalk.yellow.bold("Verb is: " + Verb));
//  console.log(chalk.yellow.bold("Item is: " + Item))

// console.log("count of process args: " + process.argv.length);
function ParseArguments() {
var searchname = process.argv.slice(2);
// process.argv.slice(2);


for (i=0; i < cmdIn.length; i++) {
  if (i==0) {
    Verb = searchname[i];
  }
  else {
    Item = searchname[i];
  }
}

executeCommand(Verb,Item);
}


function executeCommand(cmd,item) {
  //this function determinse whether the command is valid, and executes the corresponding API call to get information.
  //for reference only:  var cmdList= ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", :"help"];

  cmd = cmd.toLowerCase(); //ensure the command parsing is not case-sensitive.
    switch (cmd) {
      case "concert-this":
        // console.log(chalk.yellow.bold("search bands in town for: " + item));
        SearchBandsInTown(item);
        break;
      case "spotify-this-song":
        // console.log(chalk.yellow.bold("search spotify for: " + item));
        SearchSpotify(item);
        break;
      case "movie-this":
        // console.log(chalk.yellow.bold("search omdb for: " + item));
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
        BadArgumentsMsg("ERROR!! [" + cmd + "] is an  unknown command! Please try again!");
        // console.log(chalk.yellow.bold("Liri only recognizes these commands: " + cmdList));
    }
}

function UserHelp() {
  //this function display help to the user.
  // console.log(chalk.red.bold("**LIRI HELP**"));
  // console.log("");
  // console.log(chalk.blue.bold("Liri recognizes the following 5 commands:"));
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
   console.log(chalk.green.bold("node liri concert-this 'Guns and Roses'"));
   console.log("");
   console.log(chalk.yellow.bold("run Liri with the command Help to get information about what each Liri command does."));
   console.log("");
   console.log(chalk.green.bold("run 'node liri help\' to get more help using Liri."));
}

function SetSpotifyDefaults() {
  // this function sets the default values for when the command is 'spotify-this' and no song argument is supplied
  // console.log(chalk.yellow.bold("SETTING SPOTIFY DEFAULT"));
  Verb = "spotify-this-song";
  Item = "The Sign";
}

function SetMovieDefaults() {
  // console.log(chalk.yellow.bold("SETTING MOVIE DEFAULT"));
  Verb = "movie-this";
  Item = "Mr. Nobody";

}

function ReadFromFile() {
  let inputArray = [];
  // console.log(chalk.yellow.bold("READ THE TEXT FILE TO GET COMMAND AND ITEM"));

FS.readFile("random.txt", "utf8", function(error,data) {
  if (error) {
    return console.log(error);
  }
  // console.log(chalk.blue.bold("[" + data + "]"));
  data = data.replace(/\n/g,"");  //get rid of LF char
  data = data.replace(/\r/g,"");  //get rid of CR


  inputArray = data.split(",");
  // console.log(chalk.yellow.bold("length of input array: " + inputArray.length));

  //assume that the input array has 2 elements and element 0 is the verb, and element 1 is the item.
  Verb = inputArray[0];
  Item = inputArray[1]  //.rep
  // let s = inputArray[1].replace(/\r/,"");
  // Item = s;
  // Item=Item.replace(/\r/g,"");

  // console.log(chalk.blue.bold("Verb is: [" + Verb + "]"));
  // console.log(chalk.blue.bold("item is: [" + Item + "]"));
})

}

function SearchSpotify(verb,item) {
  // this function searches spotify for the specified item.
  // console.log(chalk.yellow.bold("FUNCTION TO SEARCH SPOTIFY FOR: " + Item));
  // this function searches spotify for the specified item.
  // console.log(chalk.yellow.bold("FUNCTION TO SEARCH SPOTIFY FOR: " + Item));

  //capture and display these:
  //Artist(s), Song name,, link to the song from Spotify, The album the song is from


  //create a new Spotify search object
  // let spotify = new Spotify({

    var spotify = new Spotify({    
    id: "527242d5f2844979aed548396a2593fc",
    secret: "2c710fca4c8d4531a24384a347378330"
  })

  // let tmp = item.split("");
  //replace all spaces with "+"; 
  //this clunky code is used because I could not figure out how to write a regex for " "
  // for (k=0; k < tmp.length; k++) {
    // if (tmp[k] == " ") {
      // tmp[k] = "+";
    // }
  // }
  // let item1 =  tmp.join("");
  

  //make the search for track
  spotify.search({ type: 'track', query: "\"" + item +  "\"" }, function(err, data) {
    if (err) {
      return console.log("Spotify search error ocurred: " + err);
    }

    console.log(chalk.yellow.bold("Count of results: " + data.tracks.items.length));

    // console.log(data);
    // return;

    console.log(chalk.yellow.bold("Output from Spotify search: "));
    for (let k=0; k<data.tracks.items.length; k++) {

      //Artist(s), Song name,, link to the song from Spotify, The album the song is from
      if (data.tracks.items[k].type == 'artist') {
        let ArtistName = data.tracks.items[k].name
      }
      // let ArtristName = data.tracks.items[k].name;
      let SongName = item //as entered by user
      console.log(data.tracks.items[k].artists);

      input.question('Hit Enter key to continue.', {hideEchoBack: true, mask: ''});

    }
    console.log(chalk.yellow.bold("end of artist output."));
    // console.log(JSON.stringify(data.tracks.items[2], undefined, 2));
    // console.log(data);
  
  })
}



function SearchBandsInTown(item) {
  //THIS function searches bands in town for the specified item.
  let tmp = item.split("");
  //replace all spaces with "+"; 
  //this clunky code is used because I could not figure out how to write a regex for " "
  for (k=0; k < tmp.length; k++) {
    if (tmp[k] == " ") {
      tmp[k] = "+";
    }
  }
  let item1 = tmp.join("");
  // console.log(chalk.yellow.bold("item after replace and join: " + item1));


  // item = item.replace(" ","=");
  // console.log(chalk.yellow.bold("FUNCTION TO SEARCH BANDS IN TOWN FOR: [" + item + "]"));

  let query = "https://rest.bandsintown.com/artists/" + item1 + "/events?app_id=codingbootcamp"
  // console.log(chalk.yellow.bold("search query: " + query));
  axios.get(query).then(
    function(response, err) {
      if (err) throw err;

      //if no results are found (i.e. response.data is an empty array) display a message and end.
      let responseCount = response.data.length;
      if (responseCount == 0) {
        console.log(chalk.red.bold("No 'concert-this' results for: '" + item + "'"));
        console.log(chalk.red.bold("Liri ends now."));
        writeToLog(LogFileName,"No 'concert-this' results for: '" + item + "'") //put it in log file that no results were found.
        LiriEndMessage();
        return;
      }
      //show the count of results and prompt user to show all, or only the first 5
      console.log(chalk.yellow.bold(responseCount + " results found for '" + item + "'"));
      let USCount = 0;
      let USresult = [];
      for (k=0; k<response.data.length; k++) {
        //this loop counts the number of US responses
        // responseCount = 0
        // USresult.push(response.data[k].venue.country); //thi line is not needed
        if (response.data[k].venue.country == "United States") {
          //increase the count of US events, and copy the result into  the USresult array.
          USresult.push(response.data[k]);
          USCount++
        }
      }
      
      let action="";
      showActions = ["Show All " + responseCount + " results at once (Liri will pause after each result, until you hit the 'Enter' key", "Show all " + USCount + " results in the United States"]

      index = input.keyInSelect(showActions, chalk.yellow.bold("Choose how you want to display your results from the list above"),{cancel: 'Cancel showing results and end Liri'});
      do  {
        if (index == -1) {
          if (GetYesNo("Are you sure you want to cancel showing the search results and end Liri?")) {
            console.log(chalk.yellow.bold("Showing 'concert-this' results for '" + item + "' canceled. Liri ends now."));
            action="No results";
            writeToLog(LogFileName,"User canceled showing 'concert-this' results for '" + item +"'");
            LiriEndMessage();
            return;
          }
          else {
            action = showActions[index]
          }
        }
        if (index == -1) {console.log(chalk.blue.bold("Action is: " + action));}
      
          switch (index) {
            case 0:
              // console.log("show all results");
              ShowAllBITResults(response.data, item, "any country");
              break;
           case 1:
              // console.log("show only results in the United States");
              ShowAllBITResults(USresult,item, "United States");
              break;
            }
          } while (action = "")
          
        // console.log("answer index is: " + index);
        // console.log(chalk.red.bold("count of Usresults: " + USresult.length));
        // console.log(chalk.red.bold("USresult list" + USresult));
      
        // action = showActions[index]
    }
  )
  .catch( function(err) {
    // console.log(chalk.red.bold("THIS IS THE CATCH FUNCTION FOR " + item1));
    writeToLog(LogFileName,"The 'concert-this' command searching for '" + item + "' failed with an error!!");
    console.log(chalk.red.bold("concert-this search error: "));
    console.log(chalk.red.bold(err.message));
    writeToLog(LogFileName,"\n" + err.message);
    let strx = err.message;
    let n = strx.search("404");

    if (n != -1) {
    console.log(chalk.red.bold("\nThe 404 error may mean that the name of the band or artist was not spelled correctly. correctly. Please try again! liri will end now."));
    writeToLog(LogFileName,"\nThe 404 error may mean that the name of the band or artist was not spelled correctly.\n" );
    LiriEndMessage();
    }


  })
  

}

function ShowAllBITResults(data, item, country) {
  //this function shows all of the Bands In Town results in a big lump
  // console.log(chalk.yellow.bold("SHOW ALL BIT RESULTS FOR " + country));
  writeToLog(LogFileName,"\nResults of 'concert-this' command for '" + item + "' in '" + country + "' \n\n");
  
  let VenueName = "";
  let VenueLoc = "";
  let EventDate = "";
  let eventCountry = "";
  let totalresponses = data.length;

  for (k = 0; k < data.length; k++) {
    //assign wanted results to variable
      VenueName = data[k].venue.name;
      VenueLoc = data[k].venue.location;
      EventDate = moment(data[k].datetime).format("MM/DD/YYYY hh:mm a")
      eventCountry = data[k].venue.country;
      
      //write to console and file alternately.
      console.log(chalk("Response " + (k+1) + " of " + totalresponses + " for '" + item  + "' in '" + country + "'" ));
      console.log(chalk.blue.bold("Country: " + eventCountry));
      writeToLog(LogFileName, "Response " + (k+1) + " of " + totalresponses + " for '" + item  + "' in '" +  country + "'\n" )

      writeToLog(LogFileName, "Country: " + eventCountry + "\n");
      console.log(chalk.blue.bold("Venue Name: " + VenueName));
      writeToLog(LogFileName,"Venue Name: " + VenueName + "\n");
      console.log(chalk.blue.bold("Venue Location: " + VenueLoc));
      writeToLog(LogFileName,"Venue Location: " + VenueLoc + "\n");
      console.log(chalk.blue.bold("Event Date: " + EventDate));
      writeToLog(LogFileName,"Event Date: " + EventDate + "\n");

      input.question('Hit Enter key to continue.', {hideEchoBack: true, mask: ''});

      console.log(""); //insert a blank line between listings
      writeToLog(LogFileName,"\n");
}
input.question(chalk.yellow.bold("Display of 'concert-this' results for " + item + " in '" + country + "' is complete. Hit Enter key to continue (Liri will end)."), {hideEchoBack: true, mask: ''});
LiriEndMessage();
}

function SearchOMDB(item) {
  // console.log(chalk.yellow.bold("FUNCTION TO SEARCH OMDB FOR: \"" + item + "\""));

  let query = "http://www.omdbapi.com/?t=" + item + "=&plot=short&apikey=trilogy"

  // console.log(query);

  axios.get(query).then (
    function(response, err) {
      if (err) throw err;


      //LOG INFO TO TERMINAL 
      // console.log("LENGTH OF RATINGS: " + response.data.Ratings.length);
      // console.log("ROTTEN TOMATOES RATING: " + response.data.Ratings[1].Value);
      writeToLog(LogFileName, "\nSelected command: '" + Verb + "' for movie '" + item + "'.\n");
      // writeToLog(LogFileName," for movie: " + Item + "\n");

      // console.log(response.data);
      console.log(chalk.yellow.bold("Title: " + response.data.Title));
      console.log(chalk.yellow.bold("Year: " + response.data.Year));
      console.log(chalk.yellow.bold("Rated: " + response.data.Rated));
      console.log(chalk.yellow.bold("IMDB Rating: " + response.data.imdbRating));
// console.log(chalk.blue.bold("type of response.data.Ratings[1].Value: " + typeof response.data.Ratings[1]))      ;
      if (response.data.Ratings[1] == undefined) {
        console.log(chalk.yellow.bold("Rotten Tomatoes Rating: not available" ));
      }
      else {
        console.log(chalk.yellow.bold("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value));
        let rottentomatoes = response.data.Ratings[1].Value;
      }
      // console.log(chalk.yellow.bold("Year: " + response.data.Year));
      console.log(chalk.yellow.bold("Country: " + response.data.Country));
      console.log(chalk.yellow.bold("Language: " + response.data.Language));
      console.log(chalk.yellow.bold("Plot: " + response.data.Plot));
      console.log(chalk.yellow.bold("Acting Cast: " + response.data.Actors));

      //LOG INFO TO LOG FILE
      let title= "Title: " + response.data.Title;
      let year= "Year: " + response.data.Year;
      let rated= "Rated: " + response.data.Rated;
      let imdbrating="IMDB Rating: " + response.data.imdbRating;

      //the rotten tomatoes rating is not always present, so need to handle that or we get a runtime error.
      if (response.data.Ratings[1] != undefined){
        let rottentomatoes="Rotten Tomatos Rating: " + response.data.Ratings[1].Value;
// console.log(chalk.yellow.bold("setting rottentomatoes to 'unknown'."));
        // rottentomatoes = "unknown";
      }

      let country="Country: " + response.data.Country;
      let language="Language: " + response.data.Language;
      let plot="Plot: " + response.data.Plot;
      let cast="Acting Cast: " + response.data.Actors;
      // console.log(chalk.red.bold("testing imdbrating before file write: " +imdbrating))
      writeToLog(LogFileName,title + "\n");
      writeToLog(LogFileName, year + "\n");
      writeToLog(LogFileName, rated + "\n");
      writeToLog(LogFileName, imdbrating + "\n");

      // console.log(chalk.yellow.bold("Type 'rottentomatoes' " + typeof rottentomatoes));
      if (response.data.Ratings[1] == undefined) {
        writeToLog(LogFileName, "Rotten Tomatoes Rating: not available." + "\n");
      }
      else {
        writeToLog(LogFileName, "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n");
      }

      writeToLog(LogFileName, country + "\n");
      writeToLog(LogFileName, language + "\n");
      writeToLog(LogFileName, plot + "\n");
      writeToLog(LogFileName, cast + "\n");
      console.log(chalk.yellow.bold("Movie-this command for '" + item + "' completed."));
      LiriEndMessage();
      }
  )
}

function InitLogFile() {
  //create a log file name. log file name should be the app name and should be stored in the am folder from which Liri is executing
  // also write a header for this log session.
  // The header should consist of 2 blank lines, the name of the app (Liri), the date and time of the session start being logged

  //first, get the path to this app:
  let sPath = process.argv[1] //.split("\\"");
    let i = sPath.length-4
  sPath = sPath.substring(0, i); //get path without app name a the end.
  // sPath = sPath.replace("liri","")
  
  let logFileName =sPath + "Liri-Log.txt";


  //now create the file and start writng out the header info, use append so existing file info is not over-written

let today = moment();
today = today.format('YYYY-MM-DD hh:mm a');

    // writeToLog(logFileName,"some stuff");
    writeToLog(logFileName,"\n\n");
    writeToLog(logFileName,"Liri SESSION STARTED AT: " + today + "\n");

    return logFileName;
}

function writeToLog(filename, msg) {
  //this function appends 'msg' to the Liri-Log.txt file.
  
  fs.appendFile(filename, msg, function(err) {    
    if (err) { return console.log(err); }      
    })
}

function GetYesNo(prompt) {
  //this function returns true if user chose Yes, false is user hit any key other than "Y"
  // assumes that input refers to the readline-sync library, and that readline-syn is installed

  if (input.keyInYN(chalk.yellow.bold(prompt + " Press Y for 'Yes' and any other key for 'No'"))) {
    return true;
  }
  else {return false;}
}

function LiriEndMessage() {
  //displays where the log file is when Liri ends
  let endtime = moment().format("MM/DD/YYYY hh:mm a");
  writeToLog(LogFileName, "\nLiri SESSION ENDED at: " + endtime);
  console.log(chalk.yellow.bold("Your Liri session has ended"));
  console.log(chalk.yellow.bold("A log file of this session is in: " + LogFileName));
}