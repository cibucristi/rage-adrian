import { useState } from "react";
import { AiOutlineHome } from 'react-icons/ai';
import { GiDeadHead, GiPirateCoat, GiUnderwearShorts, GiSonicShoes } from 'react-icons/gi';
import './App.scss';

/* --- COMPONENTS --- */
import Home from "./components/Home";
import Hair from "./components/Hair";
import Shirt from "./components/Shirt";
import Pants from "./components/Pants";
import Shoes from "./components/Shoes";

function CharacterCreator() {
    
    const [state, setState] = useState("home");
    const [sectionIndex, setSectionIndex] = useState(0);
    const [notifyText, setNotifyText] = useState("");
    const [gender, setGender] = useState("male");
    const [activeNotify, setActiveNotify] = useState(false);

    const [hair, setHairIndex] = useState(null);
    const [pants, setPantsIndex] = useState(null);
    const [shirt, setShirtIndex] = useState(null);
    const [shoes, setShoesIndex] = useState(null);

    function show_player_notify(text) {

        if (activeNotify === true) return;

        setNotifyText(text);
        setActiveNotify(true);

        setTimeout(() => {
            setActiveNotify(false);
            setNotifyText("");
        }, 5000);
    }
    return (

        <div className="background">
            <div className="container">
                <div className="card">
                    <div className="title">CHARACTER CREATOR</div>
                    <p className="subtitle">CREATE YOUR CHARACTER</p>
                </div>
                <div className="navbar">
                    <AiOutlineHome onClick={() => { if(sectionIndex !== 0) { setSectionIndex(0); setState("home")}} } className={sectionIndex === 0 ? "icon active" : "icon"} />
                    <GiDeadHead onClick={() => { if(sectionIndex !== 1) { setSectionIndex(1); setState("hair")}} } className={sectionIndex === 1 ? "icon active" : "icon"} />
                    <GiPirateCoat onClick={() => { if(sectionIndex !== 2) { setSectionIndex(2); setState("clothes")}} } className={sectionIndex === 2 ? "icon active" : "icon"} />
                    <GiUnderwearShorts onClick={() => { if(sectionIndex !== 3) { setSectionIndex(3); setState("short")}} } className={sectionIndex === 3 ? "icon active" : "icon"} />
                    <GiSonicShoes onClick={() => { if(sectionIndex !== 4) { setSectionIndex(4); setState("shoes")}} } className={sectionIndex === 4 ? "icon active" : "icon"} />
                </div>
                <div className="top-navbar">
                    {state === "home" ? <Home setGender={setGender} /> : null}
                    {state === "hair" ? <Hair gender={gender} setHairIndex={setHairIndex} hair={hair} /> : null}
                    {state === "clothes" ? <Shirt gender={gender} setShirtIndex={setShirtIndex} shirt={shirt} /> : null}
                    {state === "short" ? <Pants gender={gender} setPantsIndex={setPantsIndex} pants={pants} /> : null}
                    {state === "shoes" ? <Shoes gender={gender} setShoesIndex={setShoesIndex} shoes={shoes} /> : null}
                </div>
                <div className="create-button">
                    <button onClick={() => {

                        if (hair === null || pants === null || shirt === null || shoes === null) return show_player_notify("Caracterul tau nu este complet imbracat.");

                        mp.trigger("client::create_player_character", hair, pants, shirt, shoes);

                    }}>CREATE CHARACTER</button>
                    {activeNotify === true ? <p className="notify">{notifyText}</p> : null}
                </div>
            </div>
        </div>
    )
}
export default CharacterCreator;