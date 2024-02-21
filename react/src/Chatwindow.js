import React from 'react'
import './App.css';
import Displaytxt from './Displaytxt';

export default function Chatwindow({list}) {
  return (
    <div id='chat-window'>{list.map(function(data){
        return <Displaytxt key={list.indexOf(data)} txt={data[1]} bot={data[0]}/>
      })}</div>
  )
}
