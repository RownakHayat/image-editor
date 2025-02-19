import React from 'react';


interface MaskedTextProps {
    text: string;
  }
  const MaskedText: React.FC<MaskedTextProps> = ({ text }) => {
    // Function to mask the text
    const maskText = (text: string) => {
      const lastThree = text?.slice(-3);
      const masked = '*'.repeat(text?.length - 3) + lastThree;
      return masked;
    };
  
    return (
      <div className="masked-text">
        {maskText(text)}
        <style jsx>{`
          .masked-text {
            font-family: bangla, sans-serif;
            color: #4A4A4A;
            font-size: 16px;
            letter-spacing: 2px;
            display: inline-block;
          }
        `}</style>
      </div>
    );
  };
  
  export default MaskedText;