import { useState } from "react";
import { FaRegStar, FaRegUser, FaRegDotCircle, FaRegClock, FaStar, } from 'react-icons/fa';
import { GiBullets } from "@react-icons/all-files/gi/GiBullets";
import './App.scss';


function Hud() {

    const [safeZone, setSafeZone] = useState(false);
    const [id, setID] = useState("");
    const [online, setOnline] = useState("");
    const [cash, setCash] = useState("");
    const [bank, setBank] = useState("");

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");

    const [star, setStars] = useState(0);

    const [gun, setGun] = useState("");
    const [ammo, setAmmo] = useState(0);
    const [maxAmmo, setMaxAmmo] = useState(0);

    function formatNumber(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    window.show_player_safe_zone = (state) => setSafeZone(state);
    window.show_player_id = (id) => setID(id);
    window.show_player_online = (online) => setOnline(online);
    window.show_player_money = (cash, bank) => {

        setCash(cash);
        setBank(bank);
    }
    window.set_player_wanted = (wanted) => setStars(wanted);
    window.show_player_weapon = (gunname, ammo, maxAmmo) => {

        setGun(gunname);
        setAmmo(ammo);
        setMaxAmmo(maxAmmo);
    }

    setInterval(() => load_player_hour(), 1000);

    function load_player_hour() {

        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        setHours(hours);
        setMinutes(minutes);
    }

    return (
        <div className="container">
            <div className="top-section">
                {safeZone === true ?
                    <div className="safezone-section">
                        <p className="safe-text">SAFE-ZONE</p>
                    </div> : null}
                <div className="id-section">
                    <FaRegUser className="icon" />
                    <p className="id-text">{id}</p>
                </div>
                <div className="players-section">
                    <FaRegDotCircle className="icon" />
                    <p className="players-text">{online}</p>
                </div>
                <div className="clock-section">
                    <FaRegClock className="icon" />
                    <p className="clock-text">{hours}:{minutes}</p>
                </div>
            </div>
            <div className="center-section">
                <p className="cash">${formatNumber(cash)}</p>
                <p className="bank">${formatNumber(bank)}</p>
            </div>
            <div className="bottom-section">
                {star >= 5 && star !== 0 ? <FaStar className="icon" /> : <FaRegStar className="icon" />}
                {star >= 4 && star !== 0 ? <FaStar className="icon" /> : <FaRegStar className="icon" />}
                {star >= 3 && star !== 0 ? <FaStar className="icon" /> : <FaRegStar className="icon" />}
                {star >= 2 && star !== 0 ? <FaStar className="icon" /> : <FaRegStar className="icon" />}
                {star >= 1 ? <FaStar className="icon" /> : <FaRegStar className="icon" />}
            </div>
            <div className="gun-section">
                <p className="gun-name">{gun}</p>
            </div>
            <div className="ammo-section">
                <GiBullets className="icon" />
                <p className="ammo-text">{ammo}/{maxAmmo}</p>
            </div>
        </div>
    )
}
export default Hud;