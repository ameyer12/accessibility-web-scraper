import time
import requests
from bs4 import BeautifulSoup
from flask import Flask
from flask import request

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

@app.route('/time')
def getCurrentTime():
    return {'time': time.time()}

@app.route('/links')
def getLinks():
    results = {}
    inputLink = request.args.get('inputLink')
    # Making a GET request
    r = requests.get(inputLink)
    # Parsing the HTML
    soup = BeautifulSoup(r.content, 'html.parser')
    # # find all the anchor tags with "href"
    i = 1
    for link in soup.find_all('a'):
        link = link.get('href') 
        # if 'https' in link:
        #     results[i] = link
        #     i+=1
        # else: 
        #     i+=1
        results[i] = link
        i+=1
    return results
    