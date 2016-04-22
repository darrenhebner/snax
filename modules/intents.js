// Telegram Setup
var TelegramBot = require( "node-telegram-bot-api" );
var token = "214479349:AAFFntGpTfTzSDA2QNQ_Pud0G0cubQNbyvE";
var bot = new TelegramBot( token, { polling: false } );

// Yelp Setup
var Yelp = require( "yelp" );
var yelpkey = require( "./yelpkey" );
var yelp = new Yelp( yelpkey );

var personality = require( "./personality-helper" );
var User = require( "../models/user" );

module.exports = {
	// Return phone number for a specified restaurant
	getRestaurantPhoneNumber: function( res, msg, currentUser, callback ) {
		function makeCall( callback ) {
			var searchQuery = res.outcomes[0].entities.search_query[0].value;

			yelp.search( { term: searchQuery, location: currentUser[0].location } )
				.then( function ( data ) {
					callback( personality.contact() + data.businesses[0].phone + "." );
				})
				.catch( function ( err ) {
					console.log( err);
				});
		}

		makeCall( callback );
	},
	// Return restaurant near a specified locations 
	getRestaurantNearLocation: function( res, msg, currentUser, callback ) {
		function makecall( callback ) {
			var searchQuery = res.outcomes[0].entities.search_query[0].value;
			var location = res.outcomes[0].entities.location[0].value;
			
			yelp.search( { term: searchQuery, location: location, sort: 2 } )
				.then( function ( data ) {
					callback( personality.suggestion() + data.businesses[0].name );
				})
				.catch( function (err) {
					console.log( err );
				});
		}

		makecall( callback );
	},
	// Get rating for a specified restaurant
	getRestaurantRating: function( res, msg, currentUser, callback ) {
		function makecall( callback ) {
			var searchQuery = res.outcomes[0].entities.search_query[0].value;

			yelp.search( { term: searchQuery, location: currentUser[0].location } )
				.then( function ( data ) {
					callback( data.businesses[0].rating + "/5" );
				})
				.catch( function ( err ) {
					console.log( err );
				});
		}

		makecall( callback );
	},
	// Search nearby restaurants
	getRestaurantNearby: function( res, msg, currentUser, callback ) {
		if ( currentUser[0].location === "" ) {
			bot.sendMessage( msg.chat.id, "Could you send me your location fist?" );
			return;
		}

		var searchQuery = res.outcomes[0].entities.search_query[0].value;
		var opts = {
			reply_markup: JSON.stringify({
				keyboard: [
					["Cool, how do I get there?"],
					["Is it any good?"],
					["What's their number?"],
					["Tell me more"]
				]
			})
		};

		yelp.search( { term: searchQuery, location: currentUser[0].location, limit: 5, sort: 1 } )
			.then( function ( data ) {
				User.findOneAndUpdate( { telegram_id: currentUser[0].telegram_id}, { last_search: data }, function( err ) {
					if ( err ) throw err;
				});

				callback( personality.suggestion() + data.businesses[0].name + ". It's only " + Math.round( data.businesses[0].distance ) + " meters away.", opts );
			})
			.catch(function ( err ) {
				console.log( err );
			});
	},
	// Get number for current restaurant
	getLastRestaurantNumber: function( res, msg, currentUser, callback ) {
		var lastRestaurantNumber = currentUser[0].last_search[0].businesses[0].phone;
		callback( personality.contact() + lastRestaurantNumber );
	},
	// Get the address of the current restaurant
	getLastRestaurantAddress: function( res, msg, currentUser, callback ) {
		var lastRestaurant = currentUser[0].last_search[0].businesses[0].location;
		var lastRestaurantAddress = lastRestaurant.address[0];
		var lat = lastRestaurant.coordinate.latitude;
		var long = lastRestaurant.coordinate.longitude;

		callback( personality.directions() + lastRestaurantAddress );
		bot.sendLocation( msg.chat.id, lat, long );
	},
	// Get the rating for the current restaurant
	getLastRestaurantRating: function( res, msg, currentUser, callback ) {
		var lastRestaurantRating = currentUser[0].last_search[0].businesses[0].rating;
		callback( "I'd give it " + lastRestaurantRating + " out of 5");
	},
	// Get a brief review for the current restaurant
	getLastRestaurantReview: function( res, msg, currentUser, callback ) {
		var lastRestaurantReview = currentUser[0].last_search[0].businesses[0].snippet_text;
		callback( '"' + lastRestaurantReview + '"');
	}
};