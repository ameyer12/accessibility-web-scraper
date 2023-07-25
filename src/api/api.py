import time
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, Response
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import concurrent.futures
from urllib.parse import urlparse
import pandas as pd
import xlsxwriter
import os
import io

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

@app.route('/time')
def getCurrentTime():
    return {'time': time.asctime( time.localtime(time.time()) )}

def is_valid_url(url):
    parsed_url = urlparse(url)
    return bool(parsed_url.scheme and parsed_url.netloc)

def getLinks(inputLink):
    linkResults = {}
    global linkResultsSet
    # Making a GET request
    r = requests.get(inputLink)
    # Parsing the HTML
    soup = BeautifulSoup(r.content, 'html.parser')
    # find all the anchor tags with "href"
    i = 1
    for link in soup.find_all('a'):
        link = link.get('href')
        if is_valid_url(link):
            linkResults[i] = link
            i+=1
    linkResultsSet = set(linkResults.values())
    return list(linkResultsSet)

def automateSearch(link):
    results = {
        "link": link,
        "errors": {
            "number_of_errors": "",
            "error_descriptions": [],
        },
        "contrast_errors": {
            "number_of_contrast_errors": "",
            "contrast_error_descriptions": [],
        },
        "alerts": {
            "number_of_alerts": "",
            "alert_descriptions": [],
        },
    }

    # Create a unique temporary directory for this link
    temp_dir = os.path.join(os.getcwd(), f"temp_chromedriver_{link}")
    os.makedirs(temp_dir, exist_ok=True)

    # Setting webdriver options
    options = webdriver.ChromeOptions()
    options.binary_location = os.environ.get("/Applications/your_path/Google Chrome.app/Contents/MacOS/Google Chrome")
    options.add_argument("--headless")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-infobars")      
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--enable-network-cache=true")
    options.add_argument("--page-load-strategy=none") 

    # Use ChromeDriverManager to download the chromedriver to the temporary directory
    chromedriver_path = ChromeDriverManager(path=temp_dir).install()
    print(f"Chromedriver downloaded to {chromedriver_path}")

    # # Setting executable path
    service = Service(chromedriver_path)
    # service = Service()
    # Variable for webdriver browser
    browser = webdriver.Chrome(service=service, options=options)

    # Making initial get request to WAVE website
    browser.get("https://wave.webaim.org")

    # Automating user search
    search_input = browser.find_element(By.ID, "input_url")
    search_input.send_keys(link)
    search_input.submit()

    try:
        # Wait to ensure the page is loaded before parsing the HTML
        wait = WebDriverWait(browser, 300)
        wait.until(EC.invisibility_of_element_located((By.ID, "wave5_loading")))

        # Click on details tab
        details_tab = browser.find_element(By.ID, "detailstab")
        details_tab.click()

        # Set page source to the WAVE result page
        page_source = browser.page_source

        #Parsing the HTML
        soup = BeautifulSoup(page_source, 'html.parser')

        #Finding report content to add to file
        details = soup.find('div', {"id": "details"})
        all_issues = details.find('div', {"id": "iconlist"})

        # Finding errors content in all_issues
        errors_h3 = all_issues.find('h3', {"id": "group_error"})
        # Handling zero errors found
        if errors_h3:
            errors_num = errors_h3.get_text()
        else:
            errors_num = "0 errors"
        errors_ul = all_issues.find('ul', id='group_list_error')
        if errors_ul:
            errors_h4_list = errors_ul.find_all('h4')
            error_descriptions = [errors_h4.text for errors_h4 in errors_h4_list]
        else:
            error_descriptions = ["No errors"]

        # Adding errors content to results object
        results["errors"]["number_of_errors"] = errors_num
        results["errors"]["error_descriptions"] = error_descriptions

        # Finding contrast_errors content in all_issues
        contrast_errors_h3 = all_issues.find('h3', {"id": "group_contrast"})
        # Handling zero errors found
        if contrast_errors_h3:
            contrast_errors_num = contrast_errors_h3.get_text()
        else:
            contrast_errors_num = "0 contrast errors"
        contrast_errors_ul = all_issues.find('ul', id='group_list_contrast')
        if contrast_errors_ul:
            contrast_errors_h4_list = contrast_errors_ul.find_all('h4')
            contrast_error_descriptions = [contrast_errors_h4.text for contrast_errors_h4 in contrast_errors_h4_list]
        else:
            contrast_error_descriptions = ["No contrast errors"]

        # Adding contrast_errors content to results object
        results["contrast_errors"]["number_of_contrast_errors"] = contrast_errors_num
        results["contrast_errors"]["contrast_error_descriptions"] = contrast_error_descriptions

        # Finding alerts content in all_issues
        alerts_h3 = all_issues.find('h3', {"id": "group_alert"})
        # Handling zero alerts found
        if alerts_h3:
            alerts_num = alerts_h3.get_text()
        else: 
            alerts_num = "0 alerts"
        alerts_ul = all_issues.find('ul', id='group_list_alert')
        if alerts_ul:
            alerts_h4_list = alerts_ul.find_all('h4')
            alert_descriptions = [alerts_h4.text for alerts_h4 in alerts_h4_list]
        else:
            alert_descriptions = ["No alerts"]

        # Adding alerts content to results object
        results["alerts"]["number_of_alerts"] = alerts_num
        results["alerts"]["alert_descriptions"] = alert_descriptions
    except Exception as e:
        # Print an error message or handle the exception as needed
        print(f"Error occurred while searching WAVE for link {link}: {str(e)}")
        return results  # Return empty results or add a specific flag to indicate the error
    finally:
        # Close the webdriver
        browser.quit()
        os.rmdir(temp_dir)
    print(results)
    # Return results object
    return results


@app.route('/checkalllinks')
def checkAllLinks():
    start = time.perf_counter()
    global waveResults
    waveResults = []
    worker_num = 1

    inputLink = request.args.get('inputLink')
    
    links = getLinks(inputLink)

    with concurrent.futures.ThreadPoolExecutor(max_workers=worker_num) as executor:
        # Submit tasks for each link to be evaluated
        futures = [executor.submit(automateSearch, link) for link in links]
        print(futures)

        # Retrieve results as they become available
        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
                waveResults.append(result)
                print(f"Accessibility checked for {future}")
            except Exception as exc:
                print(f"Accessibility check for {future} generated an exception: {exc}")
    return {"waveResults": waveResults} 

def cleanLink(link):
    # Remove unwanted characters from the link and trim to 30 characters
    cleaned_link = ''.join(c for c in link if c.isalnum())[:30]
    return cleaned_link

def generateSheet(writer, results):
    # Skip processing if results are empty
    if results["errors"]["number_of_errors"] == '' and results["contrast_errors"]["number_of_contrast_errors"] == '' and results["alerts"]["number_of_alerts"] == '':
       return
    
    # Create errors table
    df1 = pd.DataFrame(results["errors"]["error_descriptions"])
    df1 = df1.transpose()
    index1 = df1.index
    index1.name = results["errors"]["number_of_errors"]

    # Ceeate contrast errors table
    df2 = pd.DataFrame(results["contrast_errors"]["contrast_error_descriptions"])
    df2 = df2.transpose()
    index2 = df2.index
    index2.name = results["contrast_errors"]["number_of_contrast_errors"]

    # Ceeate alerts table
    df3 = pd.DataFrame(results["alerts"]["alert_descriptions"])
    df3 = df3.transpose()
    index3 = df3.index
    index3.name = results["alerts"]["number_of_alerts"]

    # Format link so it can be used as sheet name
    trimmedLink = cleanLink(results["link"][:30])

    # Write all three DataFrames to the same sheet named 'results'
    df1.to_excel(writer, sheet_name=trimmedLink, startrow=2)
    df2.to_excel(writer, sheet_name=trimmedLink, startrow=len(df1)+4)
    df3.to_excel(writer, sheet_name=trimmedLink, startrow=len(df1)+len(df2)+6)

    worksheet = writer.sheets[trimmedLink]
    worksheet.write('A1', 'Link: ' + results["link"])


@app.route('/generateExcelFile', methods=['POST'])
def generateExelFile():
    global waveResults

    # Check to ensure  waveResults list is not empty
    if not waveResults:
        return {"message": "No accessibility results found to generate Excel file"}
    
    # Create the ExcelWriter object with the xlsxwriter engine
    writer = pd.ExcelWriter('results.xlsx', engine='xlsxwriter')

    try:
        # Loop over the results and generate an Excel file
        for link in waveResults:
            print(link)
            generateSheet(writer, link)
    except Exception as e:
        print(e)
        return {"message": "Error occurred while generating Excel file"}

    # Close the writer
    writer.close()
    # Send the generated Excel file as a response with appropriate headers for download
    excel_file = io.BytesIO()  # Create a bytes buffer to hold the Excel file
    with open('results.xlsx', 'rb') as f:
        excel_file.write(f.read())

    # Delete the temporary Excel file
    os.remove('results.xlsx')

    # Set response headers
    response = Response(excel_file.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response.headers["Content-Disposition"] = "attachment; filename=results.xlsx"

    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)
