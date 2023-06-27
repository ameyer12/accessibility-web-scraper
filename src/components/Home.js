import { useEffect, useState } from 'react';
import './home.css';

function Home() {

  const [currentTime, setCurrentTime] = useState(0);
  const [inputLink, setInputLink] = useState("");
  const [resultLinks, setResultLinks] = useState({});

  const fetchTime = async () => {
    const response = await fetch('/time');
    const results = await response.json();

    let time = results.time;
    setCurrentTime(time);
  }

  const fetchLinks = async (inputLink) => {
    const response = await fetch(`/links?inputLink=${encodeURIComponent(inputLink)}`);
    const results = await response.json();
    
    setResultLinks(results);
    console.log(resultLinks)
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
      <h1>Hello, World!</h1>
      <p>Current time: {currentTime}</p>
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
          fetchLinks(inputLink);
        }}
        >Button</button>
      </div>
      </div>
      <div>
        { Object.keys(resultLinks).map((index) => {
            let resultLink = resultLinks[index];

            if(typeof(resultLink) === "string" && resultLink.includes("http")){
              return <p key={index}>{resultLink}</p>
            } else {
              return null;
            }

          })
        }
      </div>
  </div>
  );
}

export default Home;
