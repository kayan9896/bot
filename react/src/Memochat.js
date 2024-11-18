import React, { useState, useEffect } from 'react';
import Chatwindow from './Chatwindow';
import { v4 as uuidv4 } from 'uuid';

export default function Memochat({ link }) {
    const [list, setList] = useState([[true, 'Ask me a question']]);
    const [id, setId] = useState(uuidv4());

    async function fetchData(message) {
        try {
            let response = await fetch(link + 'historicalp', {
                method: 'POST',
                headers: { Accept: "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage: message, userId: id })
            });
            response = await response.json();
            return response;
        } catch (e) {
            return { botResponse: 'Please ask another question later. Error: ' + e.message }
        }
    }

    async function handleclick() {
        let message = document.getElementById('in').value;
        setList(prev => [...prev, [false, message]]);
        document.getElementById('in').value = '';
        setList(prev => [...prev, [true, 'Loading...']]);
        let botmessage = await fetchData(message);
        setList(prev => {
            prev[prev.length - 1] = [true, botmessage.botResponse];
            return [...prev]
        });
    }

    useEffect(() => {
        const submit = document.getElementById('submit');
        submit.addEventListener('click', handleclick);
        return () => submit.removeEventListener('click', handleclick);
    }, []);

    return (
        <div className="w-[74%] h-full">
            <Chatwindow list={list}/>
            <div className="flex w-full h-[10%] mx-[4%] my-[2%_4%_1%_4%]">
                <textarea 
                    id="in"
                    className="w-[90%] h-[80%] text-base box-border border-none 
                             py-0 px-3 rounded-l-full bg-white"
                />
                <button 
                    id="submit"
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

