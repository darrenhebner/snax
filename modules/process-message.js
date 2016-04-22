// Telegram Setup
var TelegramBot = require( "node-telegram-bot-api" );
var token = "214479349:AAFFntGpTfTzSDA2QNQ_Pud0G0cubQNbyvE";
var bot = new TelegramBot( token, { polling: false } );

// Wit.ai Setup
var wit = require( "node-wit" );
var accessToken = "LP6M5ET5NBIEO2NGLWMMM2WAHOL6ES4R";

// Bring in intents module (Super Intense)
var intents = require( "./intents" );

// Bring in slash commands
var commands = require( "./commands" );

// Bring in the user model
var User = require( "../models/user" );

// Geocoder for converting lat/long in to a readable address for Yelp
var geocoder = require( "geocoder" );

module.exports = function( msg, currentUser ) {
    // See if incoming message is a text based message
    if ( msg.text ) {
        // Check if incoming message maches one of the slash commands
        if ( typeof commands[msg.text] == "function") {
            // If so, call this slash command
            commands[msg.text]( msg, currentUser );
        } else {
            // Get users intent via wit.ai
            wit.captureTextIntent( accessToken, msg.text, function( err, res ) {
                // Store intent and confidence score from wit response
                var intent = res.outcomes[0].intent;
                var confidence = res.outcomes[0].confidence;

                // Check if the users intent exists in modules/intents.js
                if ( typeof intents[intent] == "function" && confidence > 0.4 ) {
                    // If intent exists, call it
                    intents[intent]( res, msg, currentUser, replyToUser );

                    // return a message to sender with result
                    function replyToUser( result, opts ) {
                        bot.sendMessage( msg.chat.id, result, opts );
                    }
                } else {
                    // If the intent doesn't exist or confidence score is too low, ask user to rephrase
                    console.log( "yikes:", intent );
                    bot.sendMessage( msg.chat.id, "Sorry, could you rephrase that?" );
                }
            });
        }
    } else if ( msg.location ){
        // Check is incoming message has location data
        // Convert lat/long in to a readable address
        geocoder.reverseGeocode( msg.location.latitude, msg.location.longitude, function ( err, data ) {
            var formattedAddress = data.results[0].formatted_address;

            // Update the users current address in the database
            User.findOneAndUpdate( { telegram_id: msg.from.id }, { location: formattedAddress }, function( err, user ) {
                if ( err ) throw err;

                bot.sendMessage( msg.chat.id, "Thanks for the update! I can now show you places nearby." );
            });
        });
    } else {
        console.log( msg );
    }
};