module.exports = async function(bot, chatId, ctx, db) {
    const embed = require('../embed'); // Adapted for Telegram
    const config = require('../config');

    if (!ctx.message || !ctx.message.text || ctx.message.text.split(' ')[0].toLowerCase() !== "/secret") {
        return false;
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (args.length != 2) {
        return embed(bot, chatId, 'Need more arguments', 'You need to give 2 arguments, example: /secret yoursecretpass username');
    }

    const cmd = args[0].toLowerCase();
    if (cmd != config.secretpassword.toLowerCase()) {
        return embed(bot, chatId, 'Bad first argument', 'The first argument needs to be your secret password, example: /secret yoursecretpass username');
    }

    const username = args[1];
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], (err, rows) => {
        if (err) {
            console.error(err.message);
            return embed(bot, chatId, 'Error', 'An error occurred while accessing the database.');
        }

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO users (username, date, permissions) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, date, 0], (err) => {
                if (err) {
                    console.error(err.message);
                    return embed(bot, chatId, 'Error', 'Failed to add user to the database.');
                }
                embed(bot, chatId, 'User Added', '@' + username + ' has been added to the database as Admin.');
            });
        } else if (rows[0].permissions === 0) {
            embed(bot, chatId, 'Already Admin', '@' + username + ' is already an Admin.');
        } else {
            const updateQuery = 'UPDATE users SET permissions = 0 WHERE username = ?';
            db.query(updateQuery, [username], (err) => {
                if (err) {
                    console.error(err.message);
                    return embed(bot, chatId, 'Error', 'Failed to update user permissions.');
                }
                embed(bot, chatId, 'Upgrade Successful', '@' + username + ' is now an Admin.');
            });
        }
    });
};
