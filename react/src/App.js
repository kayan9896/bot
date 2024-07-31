import './App.css';
import React, {useEffect, useState} from 'react';
import Chatwindow from './Chatwindow';
import Goo from './Goo';
import {Link, Routes,Route} from 'react-router-dom';
import Memochat from './Memochat';
import Pdf from './Pdf';
import Cover from './Cover';
import Code from './Code';

function App() {
  let uri='https://legendary-fishstick-67w6q66jwxgh4q49-8000.app.github.dev/'
  return (
    <div className="App">
      <div className="App-header">
        <h1 style={{height:'7%',margin:'1% 0 2% 0'}}>chatbot</h1>
        <div style={{display:'flex', alignItems:'center', width:'100%',height:'85%'}}>
          <div style={{display:'flex', flexDirection:'column',alignItems:'center',height:'100%',width:'20%',borderRight:'1px dashed white'}}>
          <Link className='btn' to='/historical' >Chat with memory</Link>
          <Link className='btn' to='/'>Analyze a document</Link>
          <Link className='btn' to='/code'>Convert your code</Link>
          <Link className='btn' to='/goo'>Latest knowledge</Link>
          <Link className='btn' to='/cover'>Write cover letter</Link>
        </div>
        <Routes>
        <Route path='goo' element={<Goo link={uri}/>} />
        <Route path='historical' element={<Memochat link={uri}/>} />
        <Route path='/' element={<Pdf link={uri}/>} />
        <Route path='/cover' element={<Cover/>} />
        <Route path='/code' element={<Code/>} />
        </Routes>
        </div>
      </div>
    
    </div>
  );
}

export default App;
