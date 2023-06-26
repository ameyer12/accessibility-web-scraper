import time
import requests
from bs4 import BeautifulSoup
from flask import Flask

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

@app.route('/time')
def getCurrentTime():
    return {'time': time.time()}

@app.route('/links')
def getLinks():
    results = {}
    # Making a GET request
    r = requests.get('https://www.unt.edu/')
    # Parsing the HTML
    soup = BeautifulSoup(r.content, 'html.parser')
    # # find all the anchor tags with "href"
    i = 1
    for link in soup.find_all('a'):
        link = link.get('href') 
        results[i] = link
        i+=1
    return results
    