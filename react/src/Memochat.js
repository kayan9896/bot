import React from 'react'
import Chatwindow from './Chatwindow'
import {useState, useEffect} from 'react'
import './App.css';

export default function Memochat({link}) {
    const[list, setList] = useState([[true,'Ask me a question']]);
    async function fetchData(message) {
        try{
        let response = await fetch(link+'historicalp',{
        method: 'GET',
        headers: {Accept: "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({userMessage:message})
        });
        response= await response.json();
        return response;}catch(e){return{botResponse:'Please ask another question later. Error: '+e.message}}
    }
        
    
    async function handleclick(){
        let message = document.getElementById('in').value;
        setList(prev=>{return [...prev, [false,message]]});
        document.getElementById('in').value = '';
        setList(prev=>{return [...prev, [true,'Loading...']]});
        let botmessage= await fetchData(message);
        console.log(botmessage);
        setList(prev=>{prev[prev.length-1]=[true,botmessage.botResponse];return [...prev]});
        
    }
    useEffect(function(){
        function submitlistener() {
        let submit = document.getElementById('submit');
        submit.addEventListener('click', handleclick);
        }
        submitlistener()
    }
    ,[])
    useEffect(function(){
        let sc=document.getElementById('chat-window');
        sc.scrollTop = sc.scrollHeight;
    })
    
    return (
    <div style={{width:'74%',height:'100%'}}>
        <Chatwindow list={list}/>
          <div style={{display:'flex',width: '100%', height:'10%',margin: '2% 4% 1% 4%'}}>
          <textarea id='in'></textarea>
          <button id='submit'>submit</button>
          </div>
        </div>
  )
}
