const { Telegraf } = require('telegraf');
const config = require('./config');
const commandArgsMiddleware = require('./middleware/middleware');
const mysql = require('mysql');

const usercmd = require('./commands/user'); // 导入用户命令处理模块
const call = require('./commands/call');
const secret = require('./commands/secret');
const help = require('./commands/help');


const db = mysql.createConnection(config.dbConfig);

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});




const prefix = '!';
const ADMIN = 0;
const USER = 1;


const bot = new Telegraf('6741236105:AAGDjLFF_gBX4aP3JVMgrn6RvQO_0ty5mTY'); // 使用您的机器人Token
function checkPermissions(userId, callback) {
    // 模拟数据库查询
    // 实际上，您应该在这里查询您的数据库
    // callback(err, permissions)
}
// Admins list and permission check function
const admins = ['1575145017', '1575145017']; // Replace with actual admin Telegram IDs
function isAdmin(userId) {
    return admins.includes(userId.toString());
}

bot.use(commandArgsMiddleware());
// Command handlers
bot.command('user', ctx => usercmd(ctx, db));
bot.command('call', ctx => call(ctx, db));
bot.command('calltest', ctx => call(ctx, db));
bot.command('secret', (ctx) => {
    const chatId = ctx.chat.id;
    secret(bot, chatId, ctx, db);
});

bot.command('help', ctx => {
    const chatId = ctx.chat.id;
    const user = "@" + ctx.from.username;
    help(bot, chatId, user);
});
// Initialize your command handler


bot.on("text", (ctx) => {
 
    if (ctx.author.bot) return;

  
    if (!ctx.content.startsWith(prefix)) return;

	bot.command(['user', 'calltest', 'call', 'secret', 'help'], (ctx) => {
	const commandBody = message.content.slice(prefix.length).toLowerCase();
    const args = ctx.message.text.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    const user = "@" + ctx.author.username + '#' + ctx.from.username;
	const all = { commandBody, args, command, message, user };


  db.query('SELECT permissions FROM users WHERE userid = ?', [ctx.from.id], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
	
	const ADMIN_CMD = ['user', 'calltest'];
	const USER_CMD = ['call', 'secret', 'help'];

    let perms = result[0] ? result[0].permissions : null;

    if (!ADMIN_CMD.includes(command) && !USER_CMD.includes(command)) {
      embed(ctx, "This command doesn't exist. Please ask help to an admin.", user);
    } else if (perms != 'ADMIN' && ADMIN_CMD.includes(command)) {
      embed(ctx, "You don't have the permissions to use this command.", user);
    } else {
		//if (command == 'user') {ctx, "welcome back"， user);
		
      // Add your command logic here
      // e.g., if (command === 'user') { /* Your logic */ }
    }
  });
});
	}

)

bot.launch();