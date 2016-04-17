### [Slacky](https://github.com/slacky-bot/slacky) Middleware for Blacklisting and Whitelisting Channels and Groups

#### Use
```js
const whitelist = require('slacky-middleware-white-black-list').whitelist;
const blacklist = require('slacky-middleware-white-black-list').blacklist;
const token = process.env.SLACK_API_TOKEN;

bot.use(whitelist(['channel', 'group'], new WebClient(token)));
// OR
bot.use(blacklist(['general'], new WebClient(token)));
```
