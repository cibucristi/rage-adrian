import React from "react";
import { SlUserFemale, SlUser } from 'react-icons/sl';

function Hair({ gender, setHairIndex, hair }) {
    const numIcons = { male: 75, female: 80 }

    const icons_male = Array.from({ length: numIcons.male }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 0 }));
    const icons_female = Array.from({ length: numIcons.female }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 0 }));

    const handleIconClick = (icon) => {
        setHairIndex(icon);
    };

    return (
        <>
            <div className="title-section-top">
                <p className="title">HAIR</p>
            </div>
            <div className="hair-section">
                {gender === "male" ? icons_male.map((icon) => (
                    <>
                        <SlUser key={icon.id} className={`icon${hair && hair.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_hair", icon.drawableId);
                            }} />

                    </>
                ))
                    : icons_female.map((icon) => (
                        <SlUserFemale key={icon.id} className={`icon${hair && hair.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_hair", icon.drawableId);
                        }} />
                    ))}
            </div>
        </>
    );
}

export default Hair;
