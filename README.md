# liri-node-app
A node app to retrieve song, concert, and movie data by using Axios API calls.

# Version 0.1 
basic project set up mostly completed, still need to get API keys for the majority of functionality, specifically Spotify, Bands In Town, and OMDB.

# Version 0.2
Although searches are not yet implemented, LIRI successfully detects too many or too few arguments, invalid arguments, and displays appropriate error messages to the user.
A "help" command has been added to display messages that explain how to use LIRI.

# Version 0.3
Added code to detect the need to use the defaults for the 'spotify-this-song'command. modified argument error detection to allow 'spotify-this-song' to have no 2nd argument, and to use the hard-coded defaults, per the instructions.
Added code to populate the Verb (command) and Item (what to search for) in the case that Liri is run with the 'spotify-this-song' command and no song argument.
Added the code to carry out the "do-what-it-says" command (read from the random.tx file)
Added stubbed procedures for all search commands. (next step will be to begin implementing searches).

# Version 0.4
Added code to be able to write a log of the application's actions. Completed OMDB search code, results are displayed in the terminal and logged to a file name 'Liri-log.txt'
currently working on Bands In Town search.

# Version 0.5
Code to show Bands in Town search results compled. Next is to implement show results for only events in the US.
Added code to log when Liri session ended, and to display a message to user showing the path to the Liri-log.txt file.

# Version 0.6
All code related to the 'concert-this' command is completed, including the optin to show results for events in the US only. Fine-tuned date/time formatting.

# Version 0.7
Removed some console.log messages used for testing

# Version 0.8
Added code to handle 404 errors for the concert-this search, since it is easy to make a spelling mistake in a band or artist's name.

# Version 1.0
resolved a bug in OMDB search related to the fact that the Rotten Tomatoes rating is not always present.
commented out all testing-related console.log statements

