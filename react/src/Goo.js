import React, { useState, useEffect, useRef } from 'react'
import Chatwindow from './Chatwindow'
import { useAuth0 } from '@auth0/auth0-react';

export default function Goo({link}) {
    const[list, setList] = useState([[true,'Ask me a question']]);
    const { getAccessTokenSilently } = useAuth0();
    const inputRef = useRef(null);
    const submitButtonRef = useRef(null);
    const chatWindowRef = useRef(null);

    async function fetchData(message) {
        try {
            const token = await getAccessTokenSilently();
            let response = await fetch(link+'goop', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    Accept: "application/json", 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userMessage:message})
            });
            response = await response.json();
            return response;
        } catch(e) {
            return {botResponse:'Please ask another question later. Error: '+e.message}
        }
    }
    
    async function handleclick() {
        if (!inputRef.current) return;
        const message = inputRef.current.value;
        setList(prev => [...prev, [false, message]]);
        inputRef.current.value = '';
        setList(prev => [...prev, [true, 'Loading...']]);
        const botmessage = await fetchData(message);
        setList(prev => {
            const newList = [...prev];
            newList[newList.length-1] = [true, botmessage.botResponse];
            return newList;
        });
    }

    useEffect(() => {
        if (submitButtonRef.current) {
            submitButtonRef.current.addEventListener('click', handleclick);
            return () => submitButtonRef.current?.removeEventListener('click', handleclick);
        }
    }, []);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [list]);

    return (
        <div className="w-[74%] h-full">
            <div ref={chatWindowRef} className="relative h-[85%] w-full overflow-auto px-[4%]">
                <Chatwindow list={list}/>
            </div>
            <div className="flex w-full h-[10%] mx-[4%] my-[2%_4%_1%_4%]">
                <textarea 
                    ref={inputRef}
                    className="w-[90%] h-[80%] text-base box-border border-none 
                             py-0 px-3 rounded-l-full bg-white resize-none
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    ref={submitButtonRef}
                    className="w-[10%] text-base box-border border-none bg-white 
                             rounded-r-full border-l border-black border-solid 
                             h-[80%] cursor-pointer hover:bg-gray-100
                             transition-colors duration-200"
                >
                    submit
                </button>
            </div>
        </div>
    )
}