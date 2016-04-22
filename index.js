// Telegram Setup
var TelegramBot = require( "node-telegram-bot-api" );
var token = "214479349:AAFFntGpTfTzSDA2QNQ_Pud0G0cubQNbyvE";
var bot = new TelegramBot( token, { polling: true } );

var lookupUser = require( "./modules/lookup" );
var processMessage = require( "./modules/process-message" );

// Listen for incoming messages
bot.on( 'message', function ( msg ) {
    // See if user exists, if not create a new one
    lookupUser( msg, function( currentUser ) {
        // Process the message
        processMessage( msg, currentUser );
    });
});