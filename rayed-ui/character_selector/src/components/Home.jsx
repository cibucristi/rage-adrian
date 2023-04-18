import React from "react";

function Home({ setGender }) {
    return (

        <>
            <div className="title-section-top">
                <p className="title">GENDER</p>
            </div>
            <div className="buttons-gender">
                <button className="btn" onClick={() => {
                    setGender("male");
                    mp.trigger("client::set_player_gender_male");
                }}>Male</button>
                <button className="btn" onClick={() => {
                    setGender("female");
                    mp.trigger("client::set_player_gender_female");
                }}>Female</button>
            </div>
        </>
    )
}
export default Home;