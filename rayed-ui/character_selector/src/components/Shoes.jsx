import React from "react";
import { GiBallerinaShoes, GiConverseShoe } from 'react-icons/gi';

function Shoes({ gender, setShoesIndex, shoes }) {
    const numIcons = { male: 101, female: 105 }

    const icons_male = Array.from({ length: numIcons.male }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 0 }));
    const icons_female = Array.from({ length: numIcons.female }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 0 }));

    const handleIconClick = (icon) => {
        setShoesIndex(icon);
    };

    return (
        <>
            <div className="title-section-top">
                <p className="title">SHOES</p>
            </div>
            <div className="hair-section">
                {gender === "male" ? icons_male.map((icon) => (
                    <>
                        <GiConverseShoe key={icon.id} className={`icon${shoes && shoes.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_shoes", icon.drawableId);
                            }} />

                    </>
                ))
                    : icons_female.map((icon) => (
                        <GiBallerinaShoes key={icon.id} className={`icon${shoes && shoes.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_shoes", icon.drawableId);
                        }} />
                    ))}
            </div>
        </>
    );
}

export default Shoes;
