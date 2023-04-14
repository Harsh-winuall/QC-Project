import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [currentTime, setCurrentTime] = useState(0);
  const [url, setUrl] = useState(0);
  const [title, setTitle] = useState(0);
  const [gist, setGist] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    })

    fetch('/').then(res => res.json()).then(data => {
      setTitle(data.title);
      setUrl(data.url);
      setGist(data.gist);
    })
  }, [])

  

  return (
    <div className="App">
      <header className="App-header">
        <p>The current time is {currentTime}</p>
        <form className='App' action="/" method="post">
          <label htmlFor='url'>
            <pre>Input Your Link:</pre>
            <input type="url" name="url" className='inputurl' placeholder='Paste your url here' id='url' required />
          </label>
          <input type="submit" value="submit" name='url' id='url' />
        </form>
        <p>Title: {title}</p>
        <p>Gist: {gist}</p>
      </header>
    </div>
  );
}

export default App;
