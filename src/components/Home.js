import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import './home.css';

function Home() {

  const [currentTime, setCurrentTime] = useState(0);
  const [inputLink, setInputLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultsReturned, setResultsReturned] = useState(false)

  const isValidHttpUrl = (string) => {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      console.log(string)
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

  const fetchTime = async () => {
    try{
      const response = await fetch('https://accessibility-web-scraper-server.onrender.com/time');
      const results = await response.json();
  
      let time = results.time;
      setCurrentTime(time);
    } catch(error) {
        Swal.fire({
          title: "Failed to load current time",
          text: "Wait a few seconds and refresh the page"
        }); 
    }
  }

  const initiateCheckAllLinks = async (inputLink) => {
    try {
      if(isValidHttpUrl(inputLink) === false){
        Swal.fire({
          title: "Automation failed",
          text: "Please enter a valid URL"
        });
        return
      }

      setResultsReturned(false);
      setLoading(true)
      const response = await fetch(`https://accessibility-web-scraper-server.onrender.com/checkalllinks?inputLink=${encodeURIComponent(inputLink)}`);
      const results = await response.json();
      
      setLoading(false);
      setResultsReturned(true);
    } catch(error) {
        Swal.fire({
          title: "Automation failed",
          text: "Re-enter URL and try again"
        });
        setLoading(false);
        setResultsReturned(false);
    }
  }

  const getResultsFile = async () => {
    try {
      const response = await fetch(`https://accessibility-web-scraper-server.onrender.com/generateExcelFile`, {
          method: 'POST',
      });

      // Convert the response to a Blob to handle the file download
      const blob = await response.blob();

      // Create a URL for the Blob to trigger the download
      const url = URL.createObjectURL(blob);

      // Create an anchor element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'results.xlsx';
      a.click();

      // Clean up the URL and revoke the object URL to free up memory
      URL.revokeObjectURL(url);

      setResultsReturned(false);
    } catch(error) {
        Swal.fire({
          title: "Failed to generate file",
          text: "Try again"
        });
    }
  }

  useEffect(() => {
    try {
      fetchTime();
    } catch (error) {
      throw(error);
    }
  }, [])

  return (
    <div className="homepage">
      <h1>Input a URL:</h1>
      <p>Current date & time: {currentTime}</p>
      <div className="input-group mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Enter Link" 
          aria-label="User's Input Link" 
          aria-describedby="basic-addon2"
          onChange={(ev) => {
            ev.preventDefault();
            setInputLink(ev.target.value);
          }}
          />
      <div className="input-group-append">
        <button 
        className="btn btn-outline-secondary" 
        type="button"
        onClick={(ev) => {
          ev.preventDefault();
          initiateCheckAllLinks(inputLink);
        }}
        >Submit</button>
      </div>
      </div>
      <div>
        {loading ? (<ProgressBar
                      height="80"
                      width="80"
                      ariaLabel="progress-bar-loading"
                      wrapperStyle={{}}
                      wrapperClass="progress-bar-wrapper"
                      borderColor = 'black'
                      barColor = 'green'
                    />) : ""}
        {resultsReturned ? (<button 
                              class="btn download-button"
                              onClick={
                                getResultsFile
                              }
                            >Download</button>) : ""}
      </div>
  </div>
  );
}

export default Home;
