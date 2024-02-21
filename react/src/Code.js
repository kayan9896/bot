import React from 'react'
import './App.css';
import {useState, useEffect} from 'react'

export default function Code() {
    const[txt, setTxt] = React.useState([]);
    const[loading, setLoading] = React.useState(false);
    async function fetchData(o,c,t) {
      try{
      let response = await fetch('https://chat.openai.com/backend-api/conversation',{
      method: 'POST',
      headers: {Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJndXBlZGlsaUBjbG91dC53aWtpIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsicG9pZCI6Im9yZy1BeFFoVUFzd3ZBaW9JWFR0TGF0MGk1b1QiLCJ1c2VyX2lkIjoidXNlci1rcXZtRkxyT09QdjE0RU1yakVkNHZ3Nk4ifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDY1MzJmNTE3YmNkZTVhZjdjZDQxOWExMiIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDU0ODE5MzcsImV4cCI6MTcwNjM0NTkzNywiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvcmdhbml6YXRpb24ud3JpdGUgb2ZmbGluZV9hY2Nlc3MifQ.RdfAFOgbS0lfr_K1qbKn31v1lEU0qR_tiuLITpBIrnwuDbBg9CfBlh9cx4k1CxMFq7D8ZLuzXfFdb2rFr3LVxN0GdgnggS3WPMw_BT26rP-ZTh3yBoOhLg_6STVv_bH7KhvCrE3JjUAVsa4WIlAjRzmciLhCrDqD__9GE8XHLtKNoOXhOGq3exEq1-6JdaJ-gN_EBX4oI1u8S1Vbypyp7Hwd4hM6WMr-A69wSsIETJqBcQQ5LDTJNcgaZMztFkfPxvQ8zai9QqprRcBdxOnYlqJa0cb7oddZphklMADxM5gqllqIjdgUPE2NJGk2sZfdm02FoaUvY5U5O7uuMi1YCQ",
       "Content-Type": "application/json"},
      body: JSON.stringify(
          {"action":"next","messages":[{"id":"aaa2f527-fe5d-4dd5-a623-e363ffac5b41","author":{"role":"user"},"content":{"content_type":"text","parts":[`Convert the ${o} code:\n ${c} \n to ${t}. If the original code does not match the original language, just return a warning without the code. Otherwise, return the code only. `]},"metadata":{}}],"conversation_id":"0fe72a09-94a1-4816-9bfa-a5e73e85b163","parent_message_id":"af0f9497-73f4-4a0a-9717-77db9d257079","model":"gpt-3.5-turbo","timezone_offset_min":480,"suggestions":[],"history_and_training_disabled":false,"arkose_token":null,"conversation_mode":{"kind":"primary_assistant"},"force_paragen":false,"force_rate_limit":false})
      });
      if(!response.ok){
          let a = await response.json();
          console.log(a);
          throw new Error(a);
      }
      let a= await response.text();
      let dataSections = a.split('\n\ndata:');
          let last=dataSections[dataSections.length-3];
          let dic=JSON.parse(last);
          let botmessage=dic.message.content.parts
          console.log(dataSections,last)
      return botmessage;}catch(e){return'Please ask another question later. Error: '+e}
  }
  async function handleclick(){
      
      let ori = document.getElementById('ori').value;
      let to = document.getElementById('to').value;
      let s = document.getElementById('code').value;
      if(s===''){return alert('Please enter your code');}
      setLoading(true)
      let res= await fetchData(ori,s,to);
      res+='';
      let a = res.split('\n');
      setTxt(a)
      setLoading(false)
  }
  useEffect(function(){
      function submitlistener() {
      let submit = document.getElementById('convert');
      submit.addEventListener('click', handleclick);
      }
      submitlistener()
      
  }
  ,[])
  return (
    <div style={{display:'flex',width:'80%',height:'100%',justifyContent:'space-evenly'}}>
        <div style={{display:'flex', flexDirection:'column',height:'100%',width:'45%',alignItems:'center'}}>
            <p>Your code</p>
            <select id='ori' style={{padding:'1px',width:'30%'}}>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
                <option>C</option>
                <option>JavaScript</option>
                <option>C#</option>
                <option>HTML</option>
                <option>React</option>
                <option>React Native</option>
                <option>Go</option>
            </select>
            <textarea id='code' style={{backgroundColor: '#e7f9d8',resize:'none',height:'80%',width:'90%',margin:'4% 0',borderRadius:'1%'}}></textarea>
        </div>
        <div style={{display:'flex', flexDirection:'column',height:'100%',width:'45%',alignItems:'center'}}>
            <p>Converted to</p>
            <div style={{lineHeight:'0',width:'100%'}}>
            <select id='to' style={{padding:'1px',width:'30%',verticalAlign:'top'}}>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
                <option>C</option>
                <option>JavaScript</option>
                <option>C#</option>
                <option>HTML</option>
                <option>React</option>
                <option>React Native</option>
                <option>Go</option>
            </select>
            <button id='convert' style={{padding:'0 2px',margin:'0 20px',verticalAlign:'top',cursor:'pointer'}}>Convert</button>
            </div>
            <div style={{backgroundColor: '#efefef',height:'80%',width:'90%',margin:'4% 0',borderRadius:'1%',padding:'2px',border:'0.667px white solid',color:'black',textAlign:'left',overflow:'auto',whiteSpace:'pre-wrap',fontFamily:'monospace',fontSize:'12px'}}>
            {loading?<p>loading...</p>:txt.map(function(para,i){return <div key={i} style={{padding:'0.1% 1%'}}>{para}</div>})}
            </div>
        </div>
    </div>
  )
}
