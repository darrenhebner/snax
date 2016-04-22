// Database Setup
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/snax');

var Schema = mongoose.Schema;

// Create user schema
var userSchema = new Schema({
	telegram_id: Number,
	first_name: String,
	last_name: String,
	username: String,
	location: String,	
	last_search: Array,
	created_at: Date,
	updated_at: Date
});

var User = mongoose.model('User', userSchema);

// Update on save
userSchema.pre('save', function(next) {
	// Get the current date
	var currentDate = new Date();

	// Change the updated_at field to current date
	this.updated_at = currentDate;

	next();
});

module.exports = User;