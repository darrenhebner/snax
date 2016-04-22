# How to make a chatbot with Node.js

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