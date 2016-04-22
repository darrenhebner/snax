# How to make a chatbot with Node.js

![Snax](https://pbs.twimg.com/media/CcKyZV6UsAI-yCt.jpg:large)

## Connecting to Telegram
For this bot, I decided to use Telegram as the platform since they encourage bots and they make it dead simple to get started. There is an [awesome module](https://github.com/yagop/node-telegram-bot-api) that makes communicating with the telegram api easy. 

Replace this with your own telegram keys
```
// Telegram Setup
var TelegramBot = require( "node-telegram-bot-api" );
var token = YOUR_OWN_TOKEN;
var bot = new TelegramBot( token, { polling: false } );
```

## Understanding real people
In order for your bot to understand incoming messages from real humans, you need to use a natural language processor. For this project, I used [Wit.ai](http://wit.ai).

Wit.ai helps you understand the users *intent*. You can preconfigure possible intents for your app on the Wit.ai website. For this project, I set up food related queries such as "Are there any good pizza places nearby?". I used the [wit node module](https://github.com/wit-ai/node-wit) for connecting to the wit api.

```
// msg.text is the body of the users incoming message
wit.captureTextIntent( accessToken, msg.text, function( err, res ) {
	// Here is where you with find a .json response with lots of useful info
}
```

## Connecting to the Yelp api
Using the information that Wit.ai extracts from the users message, I can query yelps api to find useful information. 

```
// This call is made once a response is recieved from wit.
var searchQuery = res.outcomes[0].entities.search_query[0].value;

yelp.search( { term: searchQuery, location: currentUser[0].location } )
	.then( function ( data ) {
		callback( personality.contact() + data.businesses[0].phone + "." );
	})
	.catch( function ( err ) {
		console.log( err);
	});
``` 

## Making the bot feel human
In order to make the bot feel slightly more human, I programmed variations on common responses. The way the user isn’t getting the exact same response each time they ask a question. 

```
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
}
```

## Context
One problem I had was dealing with context. When you are speaking to a human you often saying things like *is it any good* or *how do I get there*. Originally, my bot would not have a clue what *it* or *there* would mean since every message was like a blank slate. Users would need to constantly specify what they are referring to, which felt clumsy. To solve this problem, I starting persisting data. I would store the users most recent search result so my bot would know what users mean by *it* or *there*.