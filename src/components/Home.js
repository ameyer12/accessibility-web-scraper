import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-loader-spinner';
import './home.css';

function Home() {

  const [currentTime, setCurrentTime] = useState(0);
  const [inputLink, setInputLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultsReturned, setResultsReturned] = useState(false)

  const fetchTime = async () => {
    const response = await fetch('https://accessibility-web-scraper-server.onrender.com/time');
    const results = await response.json();
    console.log(results)

    let time = results.time;
    setCurrentTime(time);
  }

  const initiateCheckAllLinks = async (inputLink) => {
    try {
      setLoading(true)
      const response = await fetch(`/checkalllinks?inputLink=${encodeURIComponent(inputLink)}`);
      const results = await response.json();
      
      console.log(results);
      setLoading(false);
      setResultsReturned(true);
    } catch(error) {
      throw error;
    }
  }

  const getResultsFile = async () => {
    try {
      const response = await fetch(`/generateExcelFile`, {
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
      throw error;
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
      <h1>Check your links here!</h1>
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
                              class="btn"
                              onClick={
                                getResultsFile
                              }
                            >Download</button>) : ""}
      </div>
  </div>
  );
}

export default Home;
