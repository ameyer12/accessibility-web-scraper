import { useEffect, useState } from 'react';
import './home.css';

function Home() {

  const [currentTime, setCurrentTime] = useState(0);

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
    try {
      fetchTime();

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
