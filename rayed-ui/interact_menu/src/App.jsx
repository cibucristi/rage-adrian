import { useState } from "react";
import './App.scss';

function Interact() {

    const [title, setTitle] = useState("");
    const [subtitle, setSubTitle] = useState("");
    const [description, setDescription] = useState("");
    const [button1, setButton1] = useState("");
    const [button2, setButton2] = useState("");

    window.show_player_interact_menu = (title, subtitle, description, button1, button2) => {

        setTitle(title);
        setSubTitle(subtitle);
        setDescription(description);
        setButton1(button1);
        setButton2(button2);
    }

    return (

        <div className="background">
            <div className="container">
                <div className="title-section">
                    <p className="title">{title}</p>
                    <p className="subtitle">{subtitle}</p>
                </div>
                <div className="card">
                    <p className="description">{description}</p>
                </div>
                <div className="buttons">
                    <div className="button" onClick={() => mp.trigger("client::primary_interact_button")}>
                        {button1}
                    </div>
                    <div className="button" onClick={() => mp.trigger("client::secondary_interact_button")}>
                        {button2}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Interact;