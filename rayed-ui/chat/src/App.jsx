import React from 'react';
import EventManager from '../EventManager';
import './App.scss';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.maxChars = 120;
        this.fontsize = 10;
        this.pagesize = 15;
        this.chat = React.createRef(null);

        this.state = {
            active: true,
            openChat: false,
            chat: [],
            timestamp: true,
            input: '',
            last: {
                chat: [],
                index: -1
            },
            pagesize: this.pagesize,
            fontsize: this.fontsize
        }
    }

    getTime = () => {
        const today = new Date();

        const hh = String(today.getHours()).padStart(2, '0');
        const minute = String(today.getMinutes()).padStart(2, '0');
        const seconds = String(today.getSeconds()).padStart(2, '0');

        return `[${hh}:${minute}:${seconds}]`;
    }

    detectKeyDown = (e) => {
        if (e.key === 'Escape') {
            mp.trigger('hideChat');
            this.setState({ openChat: false });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.detectKeyDown);
    }

    setChatActive(toggle) {
        if (toggle === this.state.openChat)
            return this.setState({ openChat: !toggle });

        this.setState({ openChat: toggle });
    }

    setChatShow(toggle) {
        if (toggle === this.state.active)
            return this.setState({ active: !toggle });

        this.setState({ active: toggle });
    }

    fixElement = (element) => {
        return <span dangerouslySetInnerHTML={{ __html: element.replaceAll('color: ','color: #') }} />;
    }

    componentDidMount() {
        document.addEventListener("keyup", this.detectKeyDown, true);

        EventManager.addHandler('chatData', (data) => {
            console.log(data);
            this.setState({
                timestamp: data.timestamp,
                pagesize: data.pagesize,
                fontsize: data.fontsize
            });
        })

        EventManager.addHandler('showChat', (data) => {
            this.setState({ openChat: data });
        });

        const api = {
            "chat:push": this.sendChatMessage,
            "chat:clear": this.clearChat,
            "chat:activate": this.setChatActive,
            "chat:show": this.setChatShow,
        };

        for (const fn in api) {
            mp.events.add(fn, api[fn]);
        }
        this.clearChat(100);
    }

    clearChat = (max = 20) => {
        const empty = [];
        const timestamp = this.getTime();
        for (let i = -1; ++i < max;) {
            empty.push({
                text: <>&nbsp;</>,
                timestamp: timestamp
            });
        }
        this.setState({ chat: empty });
    }

    commands = (cmdname) => {
        const _cmd = cmdname.substring(1, cmdname.length).split(' ');

        const cmd = _cmd[0];
        const params = _cmd[1];
        
        this.setState({ input: '' });
        switch (cmd) {
            case 'timestamp': {
                mp.trigger('updateChatTimestamp', !this.state.timestamp);
                this.setState({ timestamp: !this.state.timestamp });
                break;
            }
            case 'pagesize': {
                if (params === 'undefined') return null;
                const pagesize = parseInt(params);
                if (pagesize < 10 || pagesize > 30 || isNaN(pagesize))
                    return this.sendChatMessage(`<span style="color: A9C4E4">pagesize [10-30] (lines)</span>`);

                mp.trigger('updateChatFontsize', pagesize);
                this.setState({ pagesize: pagesize });
                break;
            }
            case 'fontsize': {
                if (params === 'undefined') return null;
                const fontsize = parseInt(params);
                if (fontsize < -3 || fontsize > 5 || isNaN(fontsize))
                    return this.sendChatMessage(`<span style="color: A9C4E4">Valid fontsize: -3 to 5</span>`);

                mp.trigger('updateChatPagesize', 10 + fontsize);
                this.setState({ fontsize: 10 + fontsize });
                break;
            }
            default: mp.invoke("command", cmdname.substr(1));
        }
    }

    sendChatMessage = (message) => {

        if (this.animation !== null) {
            clearTimeout(this.animation);
            this.animation = null;
        }

        this.chat.current.className = '';
        this.chat.current.style = 'transform: translateY(23px)';

        setTimeout(() => {
            this.chat.current.style = 'transform: translateY(0px)';
            this.chat.current.className = 'addNewMessage';
            this.animation = setTimeout(() => this.chat.current.className = '', 2000);
        }, 10);

        this.setState(prevState => ({
            chat: [{
                text: this.fixElement(message),
                timestamp: this.getTime()
            }, ...prevState.chat]
        }));
    }

    render() {
        if (!this.state.active)
            return null;

        return (
            <div
                className="chat"
                style={{
                    '--fontsize': this.state.fontsize,
                    '--pagesize': this.state.pagesize
                }}>
                <div className="messages">
                    <ul ref={this.chat}>
                        {this.state.chat.map((chat, i) =>
                            <li key={i}>
                                {this.state.timestamp &&
                                    <span style={{ marginRight: '8px' }}>{chat.timestamp}
                                    </span>}
                                <span>{chat.text}</span>
                            </li>
                        )}
                    </ul>
                </div>
                {this.state.openChat &&
                    <div className="bar">
                        <input
                            type="text"
                            placeholder='Scrie ceva..'
                            value={this.state.input}
                            autoFocus={true}
                            onChange={e => {
                                if (e.target.value.length > this.maxChars) return null;
                                this.setState({ input: e.target.value });
                            }}
                            onKeyDown={e => {
                                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    const x = this.state.last.index + (e.key !== 'ArrowDown' ? 1 : -1);

                                    if (x < 0)
                                        return this.setState({ input: '' })

                                    if (x > this.state.last.chat.length - 1)
                                        return null;

                                    this.setState(prevState => {
                                        prevState.input = prevState.last.chat[x];
                                        prevState.last.index = x;

                                        return prevState;
                                    });
                                    return;
                                }
                                if (e.key === 'Enter' && e.target.value.length) {

                                    this.setState(prevState => {
                                        prevState.last.chat = [e.target.value, ...prevState.last.chat];
                                        prevState.last.index = -1;
                                        prevState.input = '';
                                        prevState.openChat = false;

                                        mp.trigger('hideChat');

                                        return prevState;
                                    });

                                    if (e.target.value[0] === '/')
                                        return this.commands(e.target.value);

                                    return mp.invoke("chatMessage", e.target.value);
                                }
                            }}
                        />
                        <div className="chars">
                            {this.state.input.length + '/' + this.maxChars}
                        </div>
                    </div>}
            </div>
        )
    }
}