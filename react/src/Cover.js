import React from 'react'
import './App.css';
import {useState, useEffect} from 'react'

export default function Cover() {
  const[txt, setTxt] = React.useState([]);
  const[loading, setLoading] = React.useState(false);
  async function fetchData(p,c,s) {
    try{
    let response = await fetch('https://chat.openai.com/backend-api/conversation',{
    method: 'POST',
    headers: {Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJndXBlZGlsaUBjbG91dC53aWtpIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsicG9pZCI6Im9yZy1BeFFoVUFzd3ZBaW9JWFR0TGF0MGk1b1QiLCJ1c2VyX2lkIjoidXNlci1rcXZtRkxyT09QdjE0RU1yakVkNHZ3Nk4ifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDY1MzJmNTE3YmNkZTVhZjdjZDQxOWExMiIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDU0ODE5MzcsImV4cCI6MTcwNjM0NTkzNywiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvcmdhbml6YXRpb24ud3JpdGUgb2ZmbGluZV9hY2Nlc3MifQ.RdfAFOgbS0lfr_K1qbKn31v1lEU0qR_tiuLITpBIrnwuDbBg9CfBlh9cx4k1CxMFq7D8ZLuzXfFdb2rFr3LVxN0GdgnggS3WPMw_BT26rP-ZTh3yBoOhLg_6STVv_bH7KhvCrE3JjUAVsa4WIlAjRzmciLhCrDqD__9GE8XHLtKNoOXhOGq3exEq1-6JdaJ-gN_EBX4oI1u8S1Vbypyp7Hwd4hM6WMr-A69wSsIETJqBcQQ5LDTJNcgaZMztFkfPxvQ8zai9QqprRcBdxOnYlqJa0cb7oddZphklMADxM5gqllqIjdgUPE2NJGk2sZfdm02FoaUvY5U5O7uuMi1YCQ",
     "Content-Type": "application/json"},
    body: JSON.stringify(
        {"action":"next","messages":[{"id":"aaa2f527-fe5d-4dd5-a623-e363ffac5b41","author":{"role":"user"},"content":{"content_type":"text","parts":[`Use this draft to write a more detailed cover letter no more than 270 words:\nDear Hiring Manager,\n\nI am writing to apply for the ${p} position at ${c}. I have experience in ${s}.\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]`]},"metadata":{}}],"conversation_id":"0fe72a09-94a1-4816-9bfa-a5e73e85b163","parent_message_id":"af0f9497-73f4-4a0a-9717-77db9d257079","model":"gpt-3.5-turbo","timezone_offset_min":480,"suggestions":[],"history_and_training_disabled":false,"arkose_token":null,"conversation_mode":{"kind":"primary_assistant"},"force_paragen":false,"force_rate_limit":false})
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
    console.log('click')
    let p = document.getElementById('position').value;
    let c = document.getElementById('company').value;
    let s = document.getElementById('skills').value;
    if(p===''||c===''){return alert('Please enter the position and company');}
    setLoading(true)
    let res= await fetchData(p,c,s);
    res+='';
    let a = res.split('\n');
    setTxt(a)
    setLoading(false)
}

  return (
    <div style={{width:'80%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
    <div style={{width:'100%',height:'25%',display:'flex',justifyContent:'space-evenly'}}>
      <div style={{width:'25%',height:'60%'}}>
        <p>Position</p>
        <textarea id='position' style={{width:'100%',height:'100%',border:'1px solid white',padding:'1%',backgroundColor:'transparent',resize:'none',color:'white'}}></textarea>
      </div>
      <div style={{width:'25%',height:'60%'}}>
        <p>Company</p>
        <textarea id='company' style={{width:'100%',height:'100%',border:'1px solid white',padding:'1%',backgroundColor:'transparent',resize:'none',color:'white'}}></textarea>
      </div>
      <div style={{width:'25%',height:'60%'}}>
        <p>Skills</p>
        <textarea id='skills' style={{width:'100%',height:'100%',border:'1px solid white',padding:'1%',backgroundColor:'transparent',resize:'none',color:'white'}}></textarea>
      </div>
    </div>
    {loading?<p>loading...</p>:<button onClick={handleclick} style={{width:'10%',height:'5%',border:'1px solid white',backgroundColor:'transparent',color:'white',fontSize:'1.5vw',cursor:'pointer'}}>Submit</button>}
    <div style={{width:'90%',height:'60%',border:'1px solid white',overflow:'auto',textAlign:'left'}}>{txt.map(function(para,i){return <div key={i} style={{padding:'0.1% 1%'}}>{para}</div>})}</div>
    </div>
  )
}
