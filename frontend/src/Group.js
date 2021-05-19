import React, { useState, useEffect, useContext } from "react";
import { Redirect, useParams, useHistory  } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import MessageRoom from "./MessageRoom";
import UserContext from "./UserContext";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "./stylesheets/Group.css";
import "./stylesheets/Sections.css";
import "./stylesheets/Forms.css";

const Group = ({changeTodo, addTodoS, getGroup, leaveGroup, addMember, addAnnouncement, removeAnnouncement}) => {

    const history = useHistory();
    const {curUser} = useContext(UserContext);
    const {id} = useParams();
    const [group, setGroup] = useState(null);

    const [addMembers, setAddMembers] = useState(false);
    const [addAnnouncementF, setAddAnnouncementF] = useState(false);
    const [addTodo, setAddTodo] = useState(false);

    let progress = 0;

    const [addForm, setAddForm] = useState({
        username: "",
        role: "",
        self_username: curUser.username,
        group_id: id
    });

    const [addFormA, setAddFormA] = useState({
        announcement: "",
        username: curUser.username,
        group_id: id
    });

    const [addFormT, setAddFormT] = useState({
        todo: "",
        username: curUser.username,
        group_id: id
    });

    useEffect(function loadGroupInfo(){
        async function getGroupInfo(){
            const res = await getGroup({group_id: id, username: curUser.username});
            if (res) {
                setGroup(res);
            } else {
                return <Redirect to="/" />
            }
        }
        setGroup(null)
        getGroupInfo();
    }, [id, curUser, getGroup])

    const requestLeaveGroup = async () => {
        const res = await leaveGroup({group_id: id, username: curUser.username});
        if(res.success) {
            return history.push("/dashboard")
        }
    }

    const toggleAddMembers = () => {
        setAddMembers(!addMembers);
    }

    const toggleAddAnnouncementF = () => {
        setAddAnnouncementF(!addAnnouncementF);
    }

    const toggleAddTodo = () => {
        setAddTodo(!addTodo);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addMember(addForm);
        await refreshGroup();
        setAddMembers(false);
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setAddForm(addForm => ({
            ...addForm, [name]: value
        }));
    }

    const handleChangeA = (e) => {
        const {name, value} = e.target;
        setAddFormA(addFormA => ({
            ...addFormA, [name]: value
        }));
    }

    const handleSubmitA = async (e) => {
        e.preventDefault();
        await addAnnouncement(addFormA);
        await refreshGroup();
        setAddAnnouncementF(false);
    }

    const handleChangeT = (e) => {
        const {name, value} = e.target;
        setAddFormT(addFormT => ({
            ...addFormT, [name]: value
        }));
    }

    const handleSubmitT = async (e) => {
        e.preventDefault();
        await addTodoS(addFormT);
        await refreshGroup();
        setAddTodo(false);
    }

    const remAnnouncement = async (id, username) => {
        await removeAnnouncement({id, username});
        refreshGroup();
    }

    const refreshGroup = async () => {
        const res = await getGroup({group_id: id, username: curUser.username});
        setGroup(res);
        calcProgress();
    }

    const handleTodoChange = async (i, e) => {
        await changeTodo({id: i, level: +e.target.value});
        refreshGroup();
    }

    const calcProgress = () => {
        let complete = 0;
        let todos = 0;
        for(let todo of group.todosres){
            todos++;
            if( todo.level === 1) {
                complete+= 0.5;
            }
            if (todo.level === 2) {
                complete++;
            }
        }
        progress = Math.round(complete * 100 / todos);
    }

    if (group === null) return (<div className="loading"><span>Loading...</span></div>)

    calcProgress();

    return (
        <div className="Group">
            <div className="section upper">
                <div className="col-20 col">
                    <div className="card">
                        <h4 className="card-title">{group.group.title}
                            <div className="card-title-right">
                                <button className="card-title-right good first-right" onClick={refreshGroup}>Refresh</button>
                                <button className="card-title-right danger" onClick={requestLeaveGroup}>Leave group</button>
                            </div>
                        </h4>
                        <div className="card-content">
                            <p className="card-description">
                                {group.group.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="col-10 col">
                    <div className="card">
                        <h4 className="card-title">Todos
                            <button className="card-title-right good" onClick={toggleAddTodo}>Add todo</button>
                        </h4>
                        <div className="card-content card-section">
                            <div className="card-groups scrollbar">
                                {addTodo ?
                                    <>
                                        <form className="form" onSubmit={handleSubmitT}>
                                            <div className="form-row">
                                                <div className="form-s">
                                                    <label htmlFor="announcement">Task</label>
                                                    <input 
                                                        className="form-input"
                                                        id="todo" 
                                                        value={addForm.announcement} 
                                                        onChange={handleChangeT}
                                                        name="todo"
                                                        type="text"
                                                        required
                                                    />
                                                </div> 
                                            </div>
                                            <div className="form-row form-button-row">
                                                <button type="submit" className="form-btn">Submit</button><br/>
                                            </div>
                                        </form>
                                    </>
                                :
                                    <>
                                        {group.todosres.length ?
                                            <>
                                                {group.todosres.map((a, i) => (
                                                    <div className={`group-todo-${a.level} group-todo`} key={i}>
                                                        <select className={`select-todo-${a.level}`} value={a.level} name="todo-status" id="todo-status" onChange={(e) => handleTodoChange(a.id, e)}>
                                                            <option value="0">Uncomplete</option>
                                                            <option value="1">In Progress</option>
                                                            <option value="2">Complete</option>
                                                        </select>
                                                        <p className="todo-text">{a.todo}</p>
                                                    </div>
                                                ))}
                                            </>
                                        :
                                            <>
                                            <p className="card-description">
                                                No todos
                                            </p>
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-10 col">
                    <div className="card">
                        <h4 className="card-title">Announcements
                        <button className="card-title-right good" onClick={toggleAddAnnouncementF}>Add announcement</button>
                        </h4>
                        <div className="card-content card-section">
                        <div className="card-groups scrollbar">
                                {addAnnouncementF ?
                                    <>
                                        <form className="form" onSubmit={handleSubmitA}>
                                            <div className="form-row">
                                                <div className="form-s">
                                                    <label htmlFor="announcement">Announcement</label>
                                                    <input 
                                                        className="form-input"
                                                        id="announcement" 
                                                        value={addForm.announcement} 
                                                        onChange={handleChangeA}
                                                        name="announcement"
                                                        type="text"
                                                        required
                                                    />
                                                </div> 
                                            </div>
                                            <div className="form-row form-button-row">
                                                <button type="submit" className="form-btn">Submit</button><br/>
                                            </div>
                                        </form>
                                    </>
                                :
                                    <>
                                        {group.announcementsres.length ?
                                            <>
                                                {group.announcementsres.map((a, i) => (
                                                    <div className="group-announcement" key={i}>
                                                        <p className="a-user">{a.username}
                                                            {a.username === curUser.username ?
                                                            <span className="small-right" onClick={() => remAnnouncement(a.id, curUser.username)}>Remove</span>
                                                            : null }
                                                        </p>
                                                        <br/>
                                                        <p className="a-body">{a.body}</p>
                                                    </div>
                                                ))}
                                            </>
                                        :
                                            <>
                                            <p className="card-description">
                                                No announcements 
                                            </p>
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="col-7 col sl">
                    <div className="card">
                        <h4 className="card-title">Members - {group.users.length}
                            <button className="card-title-right good" onClick={toggleAddMembers}>Add members</button>
                        </h4>
                        <div className="card-content card-section">
                            <div className="card-groups scrollbar">
                                {addMembers ?
                                    <>
                                        <form className="form" onSubmit={handleSubmit}>
                                            <div className="form-row">
                                                <div className="form-s">
                                                    <label htmlFor="username">Username</label>
                                                    <input 
                                                        className="form-input"
                                                        id="username" 
                                                        value={addForm.username} 
                                                        onChange={handleChange}
                                                        name="username"
                                                        type="text"
                                                        required
                                                    />
                                                </div> 
                                            </div>
                                            <div className="form-row">
                                                <div className="form-s">
                                                    <label htmlFor="role">Role</label>
                                                    <input 
                                                        className="form-input"
                                                        id="role" 
                                                        value={addForm.role} 
                                                        onChange={handleChange}
                                                        name="role"
                                                        type="text"
                                                        required
                                                    />
                                                </div> 
                                            </div>
                                            <div className="form-row form-button-row">
                                                <button type="submit" className="form-btn">Add Member</button><br/>
                                            </div>
                                        </form>
                                    </>
                                :
                                    <>
                                        {group.users.map((user, i) => (
                                            <div className="group-member" key={i}>
                                                {user.image_url ?
                                                    <img src={user.image_url} className="group-member-img" alt="user-icon"></img>
                                                :   
                                                    <FontAwesomeIcon icon={faUser} className="group-member-img"/>
                                                }
                                                <p className="group-member-name">{user.username}
                                                    {user.username === curUser.username ? 
                                                        " - You" : null}
                                                    <span>{user.role}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-7 col sl">
                    <div className="card">
                        <h4 className="card-title">Overview</h4>
                        <div className="card-content card-section">
                            <CircularProgressbar 
                                value={progress} 
                                text={`Progress: ${isNaN(progress) ? "100" : progress}%`}
                                styles={buildStyles({
                                    textSize: '10px',
                                    pathColor: `#02a499`,
                                    textColor: '#FFF',
                                    trailColor: '#d6d6d6',
                                  })}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-7 col sf">
                    <div className="card">
                        <h4 className="card-title">Chat</h4>
                        <div className="card-content card-section">
                            <div className="card-groups scrollbar">
                                <MessageRoom username={curUser.username}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default Group;