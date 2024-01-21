module.exports = function embed(bot, chatId, title, description, footer = '') {
    let messageText = `<b>${title}</b>\n${description}\n\n<i>${footer}</i>`;
	
	
    bot.telegram.sendMessage(chatId, messageText, { parse_mode: 'HTML' });

};