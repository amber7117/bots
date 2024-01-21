const Telegraf = require('telegraf');
const mysql = require('mysql');
const config = require('./config');
const commandArgsMiddleware = require('./middleware/middleware');

const usercmd = require('./commands/user');
const call = require('./commands/call');
const secret = require('./commands/secret');
const help = require('./commands/help');

// Create and connect to the MySQL database
const db = mysql.createConnection(config.dbConfig);
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});
const bot = new Telegraf('6741236105:AAGDjLFF_gBX4aP3JVMgrn6RvQO_0ty5mTY');
// Function to initialize and start the bot
function initializeBot() {
 
    const admins = ['1575145017', '1575145017']; // Replace with actual admin Telegram IDs
    const prefix = config.telegramprefix;
    const ADMIN = 0;
    const USER = 1;

    bot.use(commandArgsMiddleware());

    // Command handlers
    bot.command('user', ctx => usercmd(ctx, db));
    bot.command('call', ctx => call(ctx, db));
    bot.command('calltest', ctx => call(ctx, db));
    bot.command('secret', ctx => {
        const chatId = ctx.chat.id;
        secret(bot, chatId, ctx, db);
    });
    bot.command('help', ctx => {
        const chatId = ctx.chat.id;
        const user = "@" + ctx.from.username;
        help(bot, chatId, user);
    });

    // Text message handler
    bot.on("text", (ctx) => {
        // ... your text message handling logic ...
    });

    bot.launch();
}

// Start the bot
initializeBot();
