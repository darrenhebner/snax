// Bring in the user model
var User = require( "../models/user" );

module.exports = function ( msg, callback ) {
    // Lookup the user that messaged
    User.find( { telegram_id: msg.from.id }, function( err, user ) {
        if ( err ) throw err;

        // If user doesnt't exist in database, create a new one
        if ( user.length < 1 ) {
            var newUser = new User({
                telegram_id: msg.from.id,
                first_name: msg.from.first_name,
                last_name: msg.from.last_name,
                username: msg.from.username,
                location: "",
                created_at: new Date(),
                updated_at: new Date() 
            });

            // Save the new user
            newUser.save( function( err ) {
                if ( err ) throw err;

                // Set the new user as the current user
                callback( newUser );
            });
        } else {
            // If the user does already exist, set them as the current user
            callback( user );
        }
    });
};