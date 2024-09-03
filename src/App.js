import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import QCProcess from './components/QCProcess';
import { Route, Routes } from 'react-router-dom';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UserDetailsForm } from './components/UserDetailsForm';
import StartQC from './components/StartQC';

function App() {
 const [systemInfo, setSystemInfo] = useState({});

  function handleSubmit(event) {
    event.preventDefault(); // prevent default form submission behavior
    // perform any necessary form validation here

    // send the form data to the server using an HTTP POST request
    fetch("/api/summary", {
      method: "POST",
      body: 'hello'
    }).then(res => res.json()).then(data => {
      setSystemInfo(data)
    })
  }


  return (
    <div className="App" >
      <Routes>
        <Route path='/' index element={<WelcomeScreen/>}/>
        <Route path='/qc-process' element={<QCProcess/>}/>
        <Route path='/confirm-start-qc' element={<StartQC/>}/>
      </Routes>
    </div>
  );
}

export default App;



// ---------------------------------





// import React, { useState } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import QCProcess from './components/QCProcess';

// function App() {
//  const [systemInfo, setSystemInfo] = useState({});

//   function handleSubmit(event) {
//     event.preventDefault(); // prevent default form submission behavior
//     // perform any necessary form validation here

//     // send the form data to the server using an HTTP POST request
//     fetch("/api/summary", {
//       method: "POST",
//       body: 'hello'
//     }).then(res => res.json()).then(data => {
//       setSystemInfo(data)
//     })
//   }


//   return (
//     <div className="App">

//         <button onClick={(e) => {handleSubmit(e)}}>Fetch system info</button>

//       <div>
//       <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//             <h1 style={{ color: '#333' }}>System Information</h1>
//             {Object.keys(systemInfo).map(key => (
//                 <div key={key} style={{ marginBottom: '20px' }}>
//                     <strong>{key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong> {systemInfo[key].toString()}
//                 </div>
//             ))}
//         </div>
//       </div>

//       <hr />
//       <br />
//       <div className="container">
//         <h1>Quality Check Process</h1>
//         <QCProcess />
//       </div>
//     </div>
//   );
// }

// export default App;
