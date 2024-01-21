// src/middleware/middleware.js
module.exports = () => {
  return async (ctx, next) => {
    if (ctx.updateType === 'message' && ctx.update.message.text) {
      const text = ctx.update.message.text;
      const parts = text.split(' ');
      const command = parts[0].substring(1).toLowerCase();
      const args = parts.slice(1);
      ctx.state.command = { command, args };
    }
    await next();
  };
};