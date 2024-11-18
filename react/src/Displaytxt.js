import React from 'react'
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Displaytxt({ txt, bot }) {
  txt +=''
  let a = txt.split(/(\\\[|\\\]|```)/);
  let skipNext = false;
  let isCodeBlock = false;

  const renderContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const inlineParts = line.split(/(\\\(|\\\))/);
      let skip=false;
      return (
        <div key={index}>
          {inlineParts.map((part, idx) => {
            if (skip){
              skip=false;
              return
            }
            if (part === '\\(') {
              skip=true;
              return <InlineMath key={idx}>{inlineParts[idx + 1]}</InlineMath>;
            } else if (part === '\\)') {
              return null;
            } else {
              return <span key={idx}>{part}</span>;
            }
          })}
        </div>
      );
    });
  };

  return (
    <div className={`pb-2 w-[70%] break-words flex ${bot ? '' : 'flex-row-reverse w-full'}`}>
      <div className={`
        text-base 
        p-3 
        rounded-2xl 
        flex 
        flex-col 
        relative 
        min-w-[26px] 
        text-left 
        flex-grow-0 
        text-black
        ${bot ? 
          'bg-gray-100 rounded-tl-none' : 
          'bg-[#e7f9d8] rounded-tr-none'}
      `}>
        {a.map(function (part, index) {
          if (skipNext) {
            skipNext = false;
            return;
          }

          if (part === '\\[') {
            skipNext = true;
            return <BlockMath key={index}>{a[index + 1]}</BlockMath>;
          } else if (part === '```') {
            isCodeBlock = !isCodeBlock;
            return null;
          } else if (isCodeBlock) {
            return (
              <div className="rounded-lg overflow-hidden">
                <SyntaxHighlighter key={index} language="python" style={coy}>
                  {part}
                </SyntaxHighlighter>
              </div>
            );
          } else if (part !== '\\)' && part !== '\\]') {
            return renderContent(part);
          }
        })}
      </div>
    </div>
  );
}