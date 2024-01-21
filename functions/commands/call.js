const axios = require('axios');
const qs = require('qs');
const config = require('../config'); // Adjust the path as needed

// Function to format and send messages in Telegram
function embed(ctx, title, message) {
    let formattedMessage = `<b>${title}</b>\n${message}`;
    ctx.reply(formattedMessage, { parse_mode: 'HTML' });
}

module.exports = function(ctx) {
    const args = ctx.state.command.args;
    const command = ctx.state.command.command;
    const user = ctx.from.username;

    if (command !== "call" && command !== "calltest") return false;

    if (args.length < 2) {
        return embed(ctx, 'Need more arguments', 'You need to give 2 arguments, example: /call 33612345678 paypal');
    }

    if (!args[0].match(/^\d{8,14}$/g)) {
        return embed(ctx, 'Bad phone number', 'The phone number format is incorrect. A valid example: 33612345678');
    }

    if (!args[1].match(/[a-zA-Z]+/gm)) {
        return embed(ctx, 'Bad service name', 'The service name format is incorrect. A valid example: paypal');
    }

    const testUser = command === "calltest" ? 'test' : user;
    const additionalName = args[2] ? args[2].toLowerCase() : null;

    axios.post(config.apiurl + '/call/', qs.stringify({
        password: config.apipassword,
        to: args[0],
        user: testUser,
        service: args[1].toLowerCase(),
        name: additionalName
    }))
    .then(response => {
        if (response.data && response.data.success) {
            embed(ctx, 'Call sent', 'The API call has been sent to ' + args[0] + ' using ' + args[1] + ' service.');
        } else {
            embed(ctx, 'Call failed', 'The API call was not successful.');
        }
    })
    .catch(error => {
        console.error(error);
        embed(ctx, 'Error', 'There was an error sending the API call. Please try again.');
    });

    return true;
};