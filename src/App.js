import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [gist, setGist] = useState("");

  function handleSubmit(event) {
    event.preventDefault(); // prevent default form submission behavior
    // perform any necessary form validation here

    // send the form data to the server using an HTTP POST request
    fetch("/api/summary", {
      method: "POST",
      body: new FormData(event.target)
    }).then(res => res.json()).then(data => {
      setTitle(data.title)
      setGist(data.gist)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <form className='App' onSubmit={handleSubmit}>
          <label htmlFor='url'>
            <pre>Input Your Link:</pre>
            <input type="url" name="url" className='inputurl' placeholder='Paste your url here' id='url' required onChange={(e) => setUrl(e.target.value)}/>
          </label>
          <input type="submit" value="submit" name='url' id='url'/>
        </form>

        <p>Title: {title}</p>
        <p>Gist: {gist}</p>

      </header>
    </div>
  );
}

export default App;
