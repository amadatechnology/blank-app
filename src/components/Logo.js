import { useState, useEffect } from 'react';

function Logo() {
  const [text, setText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [cursor, setCursor] = useState('');
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const logoText = '_______ LOCATIONS';
    let currentIndex = 0;
    let timeout;

    const typeNextCharacter = () => {
      setText((prevText) => prevText + logoText[currentIndex]);
      currentIndex++;

      if (currentIndex < logoText.length) {
        timeout = setTimeout(typeNextCharacter, 100);
      } else {
        setIsDone(true);
      }
    };

    timeout = setTimeout(typeNextCharacter, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (isDone) {
      setCursor('');
    } else {
      setCursor('_');
    }
  }, [isDone]);

  useEffect(() => {
    if (blink) {
      setCursor('_');
    } else {
      setCursor('');
    }

    const interval = setInterval(() => {
      setBlink((prevBlink) => !prevBlink);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="font-bold text-2xl text-white opacity-100">
      {isDone ? (
        '[ _____ ] LOCATIONS'
      ) : (
        <>
          {text}
          {cursor}
        </>
      )}
    </div>
  );
}

export default Logo;