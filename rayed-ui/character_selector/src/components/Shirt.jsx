import React from "react";
import { FaTshirt } from 'react-icons/fa';
import { IoMdShirt } from 'react-icons/io';

function Shirt({ gender, setShirtIndex, shirt }) {
    const numIcons = { male: 392, female: 414 }

    const icons_male = Array.from({ length: numIcons.male }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 11 }));
    const icons_female = Array.from({ length: numIcons.female }, (_, i) => ({ id: i + 1, drawableId: i + 1, texture: 0, component: 11 }));

    const handleIconClick = (icon) => {
        setShirtIndex(icon);
    };

    return (
        <>
            <div className="title-section-top">
                <p className="title">SHIRTS</p>
            </div>
            <div className="hair-section">
                {gender === "male" ? icons_male.map((icon) => (
                    <>
                        <FaTshirt key={icon.id} className={`icon${shirt && shirt.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_shirt", icon.drawableId);
                            }} />

                    </>
                ))
                    : icons_female.map((icon) => (
                        <IoMdShirt key={icon.id} className={`icon${shirt && shirt.id === icon.id ? " selected" : ""}`} onClick={() => {
                            handleIconClick(icon);
                            mp.trigger("client::set_player_shirt", icon.drawableId);
                        }} />
                    ))}
            </div>
        </>
    );
}

export default Shirt;
