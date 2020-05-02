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
