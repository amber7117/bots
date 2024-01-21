const mysql = require('mysql');
const config = require('../config');
const embed = require('../embed'); // Ensure this is adapted for Telegram's message format


module.exports = function(ctx, db) {

	
		const chatId = ctx.from.id;
        const args = ctx.message.text.split(' ').slice(1);
        if (args.length != 2) {
            return embed(ctx, chatId, 'Need more arguments', 'You need to give 2 arguments, example: /user add username');
        }
	    const cmd = args[0].toLowerCase();
        const username = args[1]; // Assuming the second argument is the username
        const userid = ctx.from.id; // Telegram user ID


        if (!['add', 'delete', 'info', 'setadmin'].includes(cmd)) {
            return embed(ctx, 'Bad first argument', 'The first argument needs to be add/delete/info/setadmin, example: /user add username');
        }

		
		
       switch(cmd) {
            case 'add':
             db.query('SELECT userid FROM users WHERE userid = ?', [userid], (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        return embed(ctx, 'Error', 'Database error occurred.');
                    }

                    if (rows.length > 0) {
                        return embed(ctx, 'Already User', 'This user is already in the database.');
                    }

                    db.run('INSERT INTO users (userid, username, date, permissions) VALUES (?, ?, NOW(), ?)',
                        [userid, username, 1], (err) => {
                            if (err) {
                                console.error(err.message);
                                return embed(ctx, 'Error', 'Failed to add user to the database.');
                            }
                            embed(ctx, 'User Added', 'User has been added to the database.');
                        });
                });
                break;
			case 'delete':
    // Check if the user exists in the database
    db.query('SELECT userid FROM users WHERE userid = ?', [userid], (err, rows) => {
        if (err) {
            console.error(err.message);
            return embed(ctx, 'Error', 'Database error occurred.');
        }

        // If the user is not found in the database
        if (rows.length === 0) {
            return embed(ctx, 'User Not Found', 'This user is not in the database.');
        }

        // Delete the user from the database
        db.run('DELETE FROM users WHERE userid = ?', [userid], (err) => {
            if (err) {
                console.error(err.message);
                return embed(ctx, 'Error', 'Failed to delete user from the database.');
            }

            embed(ctx, 'User Deleted', 'User has been deleted from the database.');
        });
    });
    break;
	case 'info':
    // Retrieve user information from the database
    db.query('SELECT * FROM users WHERE userid = ?', [userid], (err, rows) => {
        if (err) {
            console.error(err.message);
            return embed(ctx, 'Error', 'Database error occurred.');
        }

        // Check if the user is not in the database
        if (rows.length === 0) {
            return embed(ctx, 'User Not Found', `User with ID ${userid} is not in the database.`);
        }

        // Define the user's rank and return it in an embed
        let userInfo = rows[0];
        let rank = userInfo.permissions === 0 ? 'admin' : 'a normal user';
        embed(ctx, 'User Information', `@${username} is ${rank}.`);
    });
    break;
	case 'setadmin':
    // Check user's status in the database
    db.query('SELECT * FROM users WHERE userid = ?', [userid], (err, rows) => {
        if (err) {
            console.error(err.message);
            return embed(ctx, 'Error', 'Database error occurred.');
        }

        // If the user is not in the database, add them as an admin
        if (rows.length === 0) {
            db.query('INSERT INTO users (userid, username, date, permissions) VALUES (?, ?, NOW(), ?)', 
                     [userid, username, 0], function(err) {
                if (err) {
                    console.error(err.message);
                    return embed(ctx, 'Error', 'Failed to add user to the database as admin.');
                }
                embed(ctx, 'Admin Added', `@${username} has been added to the database as an admin.`);
            });
        } else {
            // If the user is already an admin, notify
            if (rows[0].permissions === 0) {
                return embed(ctx, 'Already Admin', `@${username} is already an admin.`);
            }

            // Otherwise, update their permissions to admin
            db.query('UPDATE users SET permissions = 0 WHERE userid = ?', [userid], function(err) {
                if (err) {
                    console.error(err.message);
                    return embed(ctx, 'Error', 'Failed to update user permissions.');
                }
                embed(ctx, 'Admin Status Updated', `@${username} is now an admin.`);
            });
        }
    });
    break;
	   default:
                embed(ctx, 'Invalid Command', 'This command is not recognized.');
                break;
        }
    
};