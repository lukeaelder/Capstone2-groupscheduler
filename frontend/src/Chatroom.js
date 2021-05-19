import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "./stylesheets/Chatroom.css"

const Chatroom = () => {
    const {roomID} = useParams();
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            socketRef.current = io.connect(process.env.REACT_APP_BASE_URL || "http://localhost:5000");
            socketRef.current.emit("join room", roomID);
            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });
            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });
            socketRef.current.on("offer", handleRecieveCall);
            socketRef.current.on("answer", handleAnswer);
            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        });
    }, [roomID]);

    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {urls: "stun:stun.stunprotocol.org"},
                {urls: 'turn:numb.viagenie.ca',credential: 'muazkh',username: 'webrtc@live.com'},
            ]
        });
        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleSelectedEvent(userID);
        return peer;
    }

    function handleSelectedEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);
        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    return (
        <div className="Chatroom">
            <div className="videos-section">
                <video autoPlay muted ref={userVideo} className="user-video video"/>
                <video autoPlay ref={partnerVideo} className="partner-video video"/>
            </div>
            <span className="roomidtext">Call ID: <br/>{roomID}</span>
        </div>
    );
};

export default Chatroom;