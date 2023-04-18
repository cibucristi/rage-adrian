import { useState } from 'react';
import './App.scss';

function InteractText() {

    const [button, setButton] = useState("E")
    const [text, setText] = useState("TO INTERACT");    

    window.show_player_interact_text = (button, text) => {

        setButton(button);
        setText(text);
    }

    return(
        <div className="container">
            <div className="section">
                <p className="button">{button}</p>
                <div className="text-section">
                    <p className="title">PRESS</p>
                    <p className="subtitle">{text}</p>
                </div>
            </div>
        </div>
    )
}
export default InteractText;