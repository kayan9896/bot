import React from 'react'
import Chatwindow from './Chatwindow'
import {useState, useEffect} from 'react'
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function Goo({link}) {
    const[list, setList] = useState([[true,'Ask me a question']]);
    const { getAccessTokenSilently } = useAuth0();
    async function fetchData(message) {
        try{
            const token = await getAccessTokenSilently({"audience":'https://dev-4u2fhsz3qpodveaq.us.auth0.com/api/v2/'});
            console.log(token)
        let response = await fetch(link+'goop',{
        method: 'POST',
        headers: {"Authorization": `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json"},
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
    // async function fetchData(message) {
    //     try{
    //     let response = await fetch('https://chat.openai.com/backend-api/conversation',{
    //     method: 'POST',
    //     headers: {Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJndXBlZGlsaUBjbG91dC53aWtpIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsicG9pZCI6Im9yZy1BeFFoVUFzd3ZBaW9JWFR0TGF0MGk1b1QiLCJ1c2VyX2lkIjoidXNlci1rcXZtRkxyT09QdjE0RU1yakVkNHZ3Nk4ifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDY1MzJmNTE3YmNkZTVhZjdjZDQxOWExMiIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDU0ODE5MzcsImV4cCI6MTcwNjM0NTkzNywiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvcmdhbml6YXRpb24ud3JpdGUgb2ZmbGluZV9hY2Nlc3MifQ.RdfAFOgbS0lfr_K1qbKn31v1lEU0qR_tiuLITpBIrnwuDbBg9CfBlh9cx4k1CxMFq7D8ZLuzXfFdb2rFr3LVxN0GdgnggS3WPMw_BT26rP-ZTh3yBoOhLg_6STVv_bH7KhvCrE3JjUAVsa4WIlAjRzmciLhCrDqD__9GE8XHLtKNoOXhOGq3exEq1-6JdaJ-gN_EBX4oI1u8S1Vbypyp7Hwd4hM6WMr-A69wSsIETJqBcQQ5LDTJNcgaZMztFkfPxvQ8zai9QqprRcBdxOnYlqJa0cb7oddZphklMADxM5gqllqIjdgUPE2NJGk2sZfdm02FoaUvY5U5O7uuMi1YCQ",
    //      "Content-Type": "application/json"},
    //     body: JSON.stringify(
    //         {"action":"next","messages":[{"id":"aaa2f527-fe5d-4dd5-a623-e363ffac5b41","author":{"role":"user"},"content":{"content_type":"text","parts":[message]},"metadata":{}}],"conversation_id":"0fe72a09-94a1-4816-9bfa-a5e73e85b163","parent_message_id":"af0f9497-73f4-4a0a-9717-77db9d257079","model":"gpt-3.5-turbo","timezone_offset_min":480,"suggestions":[],"history_and_training_disabled":false,"arkose_token":null,"conversation_mode":{"kind":"primary_assistant"},"force_paragen":false,"force_rate_limit":false})
    //     });
    //     if(!response.ok){
    //         let a = await response.json();
    //         console.log(a);
    //         throw new Error(a);
    //     }
    //     let a= await response.text();
    //     console.log(a);
    //     return a;}catch(e){return{botResponse:'Please ask another question later. Error: '+e}}
    // }
    // async function handleclick(){
    //     let message = document.getElementById('in').value;
    //     setList(prev=>{return [...prev, [false,message]]});
    //     document.getElementById('in').value = '';
    //     setList(prev=>{return [...prev, [true,'Loading...']]});
    //     let s= await fetchData(message);
    //     let dataSections = s.split('\n\ndata:');
    //     let last=dataSections[dataSections.length-3];
    //     let dic=JSON.parse(last);
    //     let botmessage=dic.message.content.parts
    //     console.log(dataSections,last)
    //     setList(prev=>{prev[prev.length-1]=[true,botmessage];return [...prev]});
        
    // }
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
          <textarea id='in' ></textarea>
          <button id='submit'>submit</button>
          </div>
        </div>
  )
}
