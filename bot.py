from telegram.ext import Application, CommandHandler

async def start(update, context):
    await update.message.reply_text("Привет! Я помогу тебе подобрать стиль интерьера.")

async def main():
    from dotenv import load_dotenv
    import os, asyncio
    load_dotenv()
    token = os.getenv("BOT_TOKEN")
    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", start))
    print("✅ Бот запущен")
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
