import React from 'react'
import Displaytxt from './Displaytxt';

export default function Chatwindow({list}) {
  return (
    <div className="relative h-[85%] w-full overflow-auto px-[4%]">
      {list.map(function(data){
        return <Displaytxt key={list.indexOf(data)} txt={data[1]} bot={data[0]}/>
      })}
    </div>
  )
}