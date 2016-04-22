function randomItem( items ) {
	return items[Math.floor( Math.random() * items.length )];
}

module.exports = {
	suggestion: function() {
		var responses = [
			"You might like ",
			"I think you should check out ",
			"This place is great — ",
			"I think you would like ",
			"I bet this place will do the trick — ",
			"If you're feeling adventurous, maybe you could check out "
		];

		return randomItem( responses );
	},
	contact: function() {
		var responses = [
			"You can give them a call at ",
			"Here's their number — ",
			"Get in touch with them at ",
			"You can get a hold of them by calling "
		];

		return randomItem( responses );
	},
	directions: function() {
		var responses = [
			"Here's their address: ",
			"Here you go: ",
			"Here's how you get there: "
		];

		return randomItem( responses );
	}
};