module.exports = {
    apiurl: 'http://localhost:1337',
    apipassword: '',

    // Telegram Bot Configuration
    telegramtoken: '6741236105:AAGEQdSHEfnCzoUd-B3JaQCaVLEiX45SfIY',
    telegramprefix: '!',

    // This can be used if your bot needs a secret password for some functionalities
    secretpassword: 'ChAnGeThIsWiThYoUrPaSsWoRdNoW!',

    // Roles are Discord-specific. If your Telegram bot uses a different way to handle roles or permissions, configure here
    botuser_rolename: 'Bot User',  // For Telegram, you might handle this differently
    admin_rolename: 'Admin',       // For Telegram, you might handle this differently
	
	dbConfig: {
        host: "20.241.101.46",
        user: "otp",
        password: "4hXSsGzEJWre7M8M",
        database: "otp"
    }
	
};