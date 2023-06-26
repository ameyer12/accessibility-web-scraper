import { useEffect, useState } from 'react';
import './home.css';

function Home() {

  const [currentTime, setCurrentTime] = useState(0);
  const [links, setLinks] = useState("");

  function sayHi(e){
    e.preventDefault();
    console.log("hi");
  }

  useEffect(() => {
    const fetchTime = async () => {
      const response = await fetch('/time');
      const results = await response.json();

      let time = results.time;
      setCurrentTime(time);
    }

    const fetchLinks = async () => {
      const response = await fetch('/links');
      console.log(await response.json());
      // const results = await response.json();

      // console.log(results);
      // setCurrentTime(time);
    }

    try {
      fetchTime();
      fetchLinks();
    } catch (error) {
      throw(error);
    }
  }, [])

  return (
    <div className="App">
      <h1>Hello, World!</h1>
      <button onClick={
        sayHi
        }>Click me</button>
      <p>Current time: {currentTime}</p>
    </div>
  );
}

export default Home;
