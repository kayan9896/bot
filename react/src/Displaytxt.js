import React from 'react'
import './App.css';

export default function Displaytxt({txt,bot}) {
  txt+='';
  let a = txt.split('\n');
  return (
    <div className={bot?'message-line':'message-line my-text'}>
        <div className={bot?'message-box':'message-box my-text'}>{a.map(function(para,i){return <div key={i}>{para}</div>})}</div>
    </div>
  )
}
