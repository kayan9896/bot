import React from 'react'
import Chatwindow from './Chatwindow'
import {useState, useEffect} from 'react'
import './App.css';

export default function Pdf({link}) {
    const[list, setList] = useState([[true,'Upload a file to get started.']]);
    const[added, setAdded] = useState(false);
    async function fetchData(message) {
        try{
        let response = await fetch(link+'process-message',{
        method: 'POST',
        headers: {Accept: "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({userMessage:message})
        });
        response= await response.json();
        return response;}catch(e){return{botResponse:'Please ask another question later. Error: '+e.message}}
    }
    async function upload(f) {
        try{
        let form= new FormData();
        form.append('file',f);
        console.log(form);
        let response = await fetch(link+'process-document',{
        method: 'POST',
        headers: {Accept: "application/json"},
        body: form
        });
        if(!response.ok){
            response = await response.json();
            throw new Error(response.botResponse);
        }
        response= await response.json();
        setAdded(true)
        return response;}catch(e){return{botResponse:''+e}}
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
    async function handlechange(){
        let file = document.getElementById('in').files[0];
        setList(prev=>{return [...prev, [true,'Uploading...']]});
        let botmessage= await upload(file);
        setList(prev=>{prev[prev.length-1]=[true,botmessage.botResponse];return [...prev]});
    }
    useEffect(function(){
        document.getElementById('in').addEventListener('change',handlechange)
    },[])
    useEffect(function(){
        let sc=document.getElementById('chat-window');
        sc.scrollTop = sc.scrollHeight;
    })
    
    return (
    <div style={{width:'74%',height:'100%'}}>
        <Chatwindow list={list}/>
          <div style={{display:'flex',width: '100%', height:'10%',margin: '2% 4% 1% 4%'}}>
          {added?<textarea id='in' ></textarea>:<input id='in' type='file' accept='.pdf' />}
          <button id='submit'>submit</button>
          </div>
        </div>
  )
}

