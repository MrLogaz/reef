import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.utils import exceptions, executor
import json

class MessageReceiver:
    def __init__(self, addr: str, port: int, loop):
        coro = asyncio.start_server(self._tcp_reader, addr, port)
        self._server = loop.run_until_complete(coro)
        self._log = logging.getLogger(name="TCPReader")
        
    async def _tcp_reader(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        timeout = 30
        while True:
            raw_data = await asyncio.wait_for(reader.readline(), timeout=timeout)
            if raw_data:
                try:
                    data = json.loads(raw_data.decode("utf-8"))
                    self._log.info('Message recieved')
                    await queue.put(data)
                except:
                    self._log.error("Parsing data failed")
        writer.close()


class Notifier:
    def __init__(self, token, loop):
        self._token1 = ['af9s8fh28h34oi2134']
        self._token2 = ['sdfasoot3fb2gdfnp7']
        self._provider1 = []
        self._provider2 = []
        self._bot = Bot(token=token, parse_mode=types.ParseMode.HTML)
        self._dp = Dispatcher(self._bot, loop=loop)
        self._log = logging.getLogger('broadcast')

    def _setup_handlers(self):
        self._dp.register_message_handler(self._start, commands=['start'])
        self._dp.register_message_handler(self._auth, commands=['auth'])

    def _get_users(self, provider):
        if provider == 1:
            return self._provider1
        elif provider == 2:
            return self._provider2
        else:
            self._log.error("Unable to get user list")

    async def _start(self, message: types.Message):
        await self._send_message(message.from_user.id, 'Привет. Для авторизации введи: /auth ТВОЙ_ТОКЕН_ЗДЕСЬ.')

    async def _auth(self, message: types.Message):
        if message.get_args() in self._token1:
            self._provider1.append(message.from_user.id)
            await self._send_message(message.from_user.id, 'Авторизация прошла успешно.')
        elif message.get_args() in self._token2:
            self._provider2.append(message.from_user.id)
            await self._send_message(message.from_user.id, 'Авторизация прошла успешно.')
        else:
            await self._send_message(message.from_user.id, 'Ошибка авторизации. Неверный токен.')

    async def _start_broadcasting(self):
        self._log.info(f"Waiting messages for recieving")
        while True:
            data = await queue.get()
            print(data)
            for user_id in self._get_users(data["provider"]):
                if await self._send_message(user_id, data):
                    await asyncio.sleep(.05)
                
    async def _send_message(self, user_id: int, text: str) -> bool:
        try:
            await self._bot.send_message(user_id, text)
        except exceptions.BotBlocked:
            self._log.error(f"Target [ID:{user_id}]: blocked by user")
        except exceptions.ChatNotFound:
            self._log.error(f"Target [ID:{user_id}]: invalid user ID")
        except exceptions.RetryAfter as e:
            self._log.error(f"Target [ID:{user_id}]: Flood limit is exceeded. Sleep {e.timeout} seconds.")
            await asyncio.sleep(e.timeout)
            return await send_message(user_id, text)  # Recursive call
        except exceptions.UserDeactivated:
            self._log.error(f"Target [ID:{user_id}]: user is deactivated")
        except exceptions.TelegramAPIError:
            self._log.exception(f"Target [ID:{user_id}]: failed")
        else:
            self._log.info(f"Target [ID:{user_id}]: success")
            return True
        return False

    def run(self, server: MessageReceiver):
        self._setup_handlers()
        self._dp.loop.create_task(self._start_broadcasting())
        executor.start_polling(self._dp)


if __name__ == '__main__':
    global queue
    queue = asyncio.Queue()
    loop = asyncio.get_event_loop()
    API_TOKEN = '948975778:AAF97t5CXYwIzwbXxNPXy1wq9X8bjscFaAQ'
    logging.basicConfig(level=logging.INFO)


    server = MessageReceiver("localhost", 8080, loop)
    notifier = Notifier(API_TOKEN, loop)
    notifier.run(server)




