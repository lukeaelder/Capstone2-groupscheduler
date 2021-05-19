import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import UserContext from "./UserContext";
import "./stylesheets/Sections.css"
import "./stylesheets/Forms.css";

const NewGroup = ({createGroup}) => {
    const history = useHistory();
    const {curUser} = useContext(UserContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        username: curUser.username
    });

    const [formErrors, setFormErrors] = useState({
        title: false,
        description: false
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData, [name]: value
        }));
    }

    const validateGroup = () => {
        let valid = true;
        setFormErrors({
            title: false,
            description: false
        })
        if (formData["title"].length < 1){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "title": true
            }))
        }
        if (formData["description"].length < 1){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "description": true
            }))
        }
        return valid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = validateGroup();
        if (valid){
            let res = await createGroup(formData);
            if(res.success){
                history.push("/dashboard");
            } else {}
        }
    }

    return (
        <div className="NewGroup">
            <div className="section">
                <div className="col-20 col">
                    <div className="card formcard">
                        <h4 className="card-title">Create a new group</h4>
                        <div className="card-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-s">
                                        <label htmlFor="title">Title</label>
                                        <input 
                                            className={`form-input ${formErrors.title ? "input-error" : ""}`}
                                            id="title" 
                                            value={formData.title} 
                                            onChange={handleChange}
                                            name="title"
                                            type="text"
                                        />
                                        {formErrors.title ? <span className="form-error">This value is required</span> : null}
                                    </div>
                                    <div className="form-s">
                                        <label htmlFor="description">Description</label>
                                        <input 
                                            className={`form-input ${formErrors.description ? "input-error" : ""}`}
                                            id="description" 
                                            value={formData.description} 
                                            onChange={handleChange}
                                            name="description"
                                            type="text"
                                        />
                                        {formErrors.description ? <span className="form-error">This value is required</span> : null}
                                    </div>
                                </div> 
                                <div className="form-row form-button-row">
                                    <button type="submit" className="form-btn">Create</button><br/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewGroup;