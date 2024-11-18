import React, { useState, useEffect, useRef } from 'react'
import Chatwindow from './Chatwindow'

export default function Pdf({link}) {
    const[list, setList] = useState([[true,'Upload a file to get started.']]);
    const[added, setAdded] = useState(false);
    const chatWindowRef = useRef(null);
    const submitButtonRef = useRef(null);
    const inputRef = useRef(null);

    async function fetchData(message) {
        try{
            let response = await fetch(link+'process-message',{
                method: 'POST',
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                body: JSON.stringify({userMessage:message})
            });
            response= await response.json();
            return response;
        } catch(e) {
            return{botResponse:'Please ask another question later. Error: '+e.message}
        }
    }

    async function upload(f) {
        try{
            let form= new FormData();
            form.append('file',f);
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
            return response;
        } catch(e) {
            return{botResponse:''+e}
        }
    }

    async function handleclick(){
        if (!inputRef.current) return;
        let message = inputRef.current.value;
        setList(prev=>{return [...prev, [false,message]]});
        inputRef.current.value = '';
        setList(prev=>{return [...prev, [true,'Loading...']]});
        let botmessage= await fetchData(message);
        setList(prev=>{prev[prev.length-1]=[true,botmessage.botResponse];return [...prev]});
    }

    async function handlechange(){
        if (!inputRef.current?.files) return;
        let file = inputRef.current.files[0];
        setList(prev=>{return [...prev, [true,'Uploading...']]});
        let botmessage= await upload(file);
        setList(prev=>{prev[prev.length-1]=[true,botmessage.botResponse];return [...prev]});
    }

    useEffect(() => {
        if (submitButtonRef.current) {
            submitButtonRef.current.addEventListener('click', handleclick);
            return () => {
                submitButtonRef.current?.removeEventListener('click', handleclick);
            };
        }
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('change', handlechange);
            return () => {
                inputRef.current?.removeEventListener('change', handlechange);
            };
        }
    }, []);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [list]); // Add list as dependency to scroll on new messages

    return (
        <div className="w-[74%] h-full">
            <div ref={chatWindowRef} className="relative h-[85%] w-full overflow-auto px-[4%]">
                <Chatwindow list={list}/>
            </div>
            <div className="flex w-full h-[10%] mx-[4%] my-[2%_4%_1%_4%]">
                {added ? (
                    <textarea 
                        ref={inputRef}
                        className="w-[90%] h-[80%] text-base box-border border-none 
                                 py-0 px-3 rounded-l-full bg-white"
                    />
                ) : (
                    <input 
                        ref={inputRef}
                        type="file" 
                        accept=".pdf"
                        className="w-[90%] h-[80%] text-base box-border border-none 
                                 py-0 px-3 rounded-l-full bg-white
                                 file:border-0 file:bg-transparent
                                 file:text-base file:cursor-pointer
                                 file:py-[1%] file:px-[40%]
                                 file:rounded-[0.2em]
                                 file:transition-all file:duration-1000"
                    />
                )}
                <button 
                    ref={submitButtonRef}
                    className="w-[10%] text-base box-border border-none bg-white 
                             rounded-r-full border-l border-black border-solid 
                             h-[80%] cursor-pointer hover:bg-gray-100"
                >
                    submit
                </button>
            </div>
        </div>
    )
}