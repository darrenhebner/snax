// Telegram Setup
var TelegramBot = require( "node-telegram-bot-api" );
var token = "214479349:AAFFntGpTfTzSDA2QNQ_Pud0G0cubQNbyvE";
var bot = new TelegramBot( token, { polling: false } );

// Yelp Setup
var Yelp = require( "yelp" );
var yelpkey = require( "./yelpkey" );
var yelp = new Yelp( yelpkey );

var personality = require( "./personality-helper" );

module.exports = {
	"/pizza" : function( msg, currentUser ) {
		// Search Yelp for nearest pizza place
		yelp.search( { term: "pizza", location: currentUser[0].location, sort: 1 } ) 
			.then( function( data ) {
				bot.sendMessage( msg.chat.id, "Pizza is only " + Math.round( data.businesses[0].distance ) + " meters away! Check out " + data.businesses[0].name );
			})
			.catch( function( err ) {
				console.log( err );
			});
	},
	"/coffee" : function( msg, currentUser ) {
		// Search Yelp for nearest coffee shop
		yelp.search( { term: "coffee", location: currentUser[0].location, sort: 1 } ) 
			.then( function( data ) {
				bot.sendMessage( msg.chat.id, "Coffee is only " + Math.round( data.businesses[0].distance ) + " meters away! Check out " + data.businesses[0].name );
			})
			.catch( function( err ) {
				console.log( err );
			});
	},
	"/random" : function( msg, currentUser ) {
		// Randomly pick a restaurant for the user
		yelp.search( { term: "restaurant", location: currentUser[0].location } ) 
			.then( function( data ) {
				var randNum = Math.floor( Math.random() * data.businesses.length );
				bot.sendMessage( msg.chat.id, personality.suggestion() + data.businesses[randNum].name );
			})
			.catch( function( err ) {
				console.log( err );
			});
	}
};