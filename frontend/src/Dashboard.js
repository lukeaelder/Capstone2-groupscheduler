import React, { useContext, useState } from "react";
import { NavLink, useHistory } from 'react-router-dom';
import UserContext from "./UserContext";
import { v1 as uuid } from "uuid";
import "./stylesheets/Sections.css";
import "./stylesheets/Dashboard.css";

const Dashboard = () => {
    const history = useHistory();

    const [formData, setFormData] = useState("");

    const {curUser, userGroups} = useContext(UserContext);

    const handleChange = (e) => {
        setFormData(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        history.push(`/room/${formData}`);
    }

    const createChatRoom = () => {
        const id = uuid();
        history.push(`/room/${id}`);
    }

    return (
        <div className="home">
            <div className="section upper">
                <div className="col-20 col">
                    <div className="card">
                        <h4 className="card-title">{curUser.username}</h4>
                        <div className="card-content">
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="col-10 col">
                    <div className="card">
                        <h4 className="card-title">Your groups</h4>
                        <div className="card-content-block">
                            <div className="card-groups scrollbar">
                                {userGroups === null ?
                                    <p className="card-description">
                                        You don't appear to be in any groups. 
                                    </p>
                                :
                                    <>
                                        {userGroups.map((group, i) => (
                                            <NavLink exact to={`/groups/${group.id}`} key={i} className="group-link">
                                                <p className="group-link-title">{group.title}</p>
                                                <p className="group-link-desc">{group.description}</p>
                                            </NavLink>
                                        ))}
                                    </>
                                }
                            </div>
                            <NavLink exact to="/groups/new" className="form-button-row">
                                <button className="card-button">Create new group</button>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="col-10 col">
                    <div className="card">
                        <h4 className="card-title">Video Calling</h4>
                        <div className="card-content-block">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-row form-button-row call-btn-row">
                                    <button className="form-btn call-btn" onClick={createChatRoom}>Start a new call</button>
                                </div>
                                <div className="form-row">
                                    <div className="form-s">
                                        <input 
                                            className="form-input call-input"
                                            id="username" 
                                            value={formData} 
                                            onChange={handleChange}
                                            name="username"
                                            type="text"
                                            placeholder="call id"
                                        />
                                    </div>
                                </div> 
                                <div className="form-row form-button-row call-btn-row">
                                    <button type="submit" className="form-btn call-btn">Join call</button><br/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;