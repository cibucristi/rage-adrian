import React from "react";
import { GiUnderwearShorts, GiLargeDress } from 'react-icons/gi';

function Pants({ gender, setPantsIndex, pants }) {
    const numIcons = { male: 143, female: 150 }

    const icons_male = Array.from({ length: numIcons.male }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 11 }));
    const icons_female = Array.from({ length: numIcons.female }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 11 }));

    const handleIconClick = (icon) => {
        setPantsIndex(icon);
    };

    return (
        <>
            <div className="title-section-top">
                <p className="title">LEGS</p>
            </div>
            <div className="hair-section">
                {gender === "male" ? icons_male.map((icon) => (
                    <>
                        <GiUnderwearShorts key={icon.id} className={`icon${pants && pants.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_pants", icon.drawableId);
                        }} />

                    </>
                ))
                    : icons_female.map((icon) => (
                        <GiLargeDress key={icon.id} className={`icon${pants && pants.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_pants", icon.drawableId);
                        }} />
                    ))}
            </div>
        </>
    );
}

export default Pants;
