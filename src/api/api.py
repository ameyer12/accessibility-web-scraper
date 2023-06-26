import time
# import asyncio
from flask import Flask

app = Flask(__name__)

@app.route('/time')

def getCurrentTime():
    return {'time': time.time()}
