import { useState, useRef, useEffect } from "react";
import { AiFillSetting } from 'react-icons/ai';
import './App.scss';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 't' && !isOpen) {
                event.preventDefault();
                setIsOpen(true);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    function handleSendMessage(event) {
        if (event.key === "Enter") {
            if (isOpen === false) return;
            setMessages([...messages, currentMessage]);
            setCurrentMessage('');
            setHistoryIndex(-1);
            setIsOpen(false);
        }
    }

    function handleInputBlur() {
        setIsOpen(false);
    }

    function handleWheel(event) {
        if (!isOpen) {
            event.preventDefault();
            const container = messagesContainerRef.current;
            container.scrollTop += event.deltaY;
        }
    }

    function handleInputChange(event) {
        setCurrentMessage(event.target.value);
    }

    function handleKeyUp(event) {
        if (event.key === "ArrowUp") {
            const index = messages.length + historyIndex;
            if (index >= 0 && index < messages.length) {
                setCurrentMessage(messages[index]);
                setHistoryIndex(historyIndex - 1);
            }
        } else if (event.key === "ArrowDown") {
            const index = messages.length + historyIndex + 1;
            if (index >= 0 && index < messages.length) {
                setCurrentMessage(messages[index]);
                setHistoryIndex(historyIndex + 1);
            } else {
                setCurrentMessage("");
                setHistoryIndex(-1);
            }
        }
    }

    return (
        <div className="container">
            <div ref={messagesContainerRef} className="messages" onWheel={handleWheel}>
                {messages.map((message, index) => (
                    <p key={index} className="message">{message}</p>
                ))}
            </div>
            {isOpen === true ? (
                <div className="input-section">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Enter '/' command."
                        value={currentMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleSendMessage}
                        onBlur={handleInputBlur}
                        onKeyUp={handleKeyUp}
                    />
                    <AiFillSetting className="icon" />
                </div>
            ) : null}
        </div>
    );
}

export default Chat;
