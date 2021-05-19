import React, {useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "./stylesheets/Message.css";
import "./stylesheets/Forms.css";

const MessageRoom = ({username}) => {
    const {id} = useParams();
    const socketRef = useRef();

    const [messages, setMessages] = useState([]);

    const [formData, setFormData] = useState("");

    useEffect(() => {
        socketRef.current = io.connect(process.env.REACT_APP_BASE_URL || "http://localhost:5000");
        socketRef.current.emit("join chat-room", id);

        socketRef.current.on("chat-message", data => {
            setMessages(messages => ([...messages, {username: data.username, message: data.message}]));
        });

    }, [id]);

    const sendChatMessgae = (e) => {
        e.preventDefault();
        socketRef.current.emit("send-chat-message", id, username, formData);
        setFormData("");
    }

    return (
        <div className="MessageRoom">
            {messages.length ?
                <>
                    {messages.map((a, i) => (
                        <div key={i}>
                            {a.username === username ?
                                <div className="message-self" key={i}>
                                    <span className="message-username-self">{a.username}</span>
                                    <span className="message-text-self">{a.message}</span>
                                </div>
                            :
                                <div className="message" key={i}>
                                    <span className="message-username">{a.username}</span>
                                    <span className="message-text">{a.message}</span>
                                </div>
                            }
                        </div>
                    ))}
                </>
            : null }
            <form onSubmit={sendChatMessgae} className="chat-form">
                <input 
                    className="form-input"
                    value={formData}
                    onChange={e => setFormData(e.target.value)}
                    type="text"
                    required
                    placeholder="Enter your text"
                />
                <button type="submit" className="chat-btn">Send</button>
            </form>
        </div>
    )
}

export default MessageRoom;