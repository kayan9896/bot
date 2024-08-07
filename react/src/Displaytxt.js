import React from 'react'
import './App.css';
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
    // Split the content by line breaks
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Split line by inline math
      console.log(line)
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
    <div className={bot ? 'message-line' : 'message-line my-text'}>
      <div className={bot ? 'message-box' : 'message-box my-text'}>
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
              <SyntaxHighlighter key={index} language="python" style={coy}>
                {part}
              </SyntaxHighlighter>
            );
          } else if (part !== '\\)' && part !== '\\]') {
            return renderContent(part);
          }
        })}
      </div>
    </div>
  );
}