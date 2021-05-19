import React, {useState} from "react";
import { NavLink, useHistory } from 'react-router-dom';
import "./stylesheets/Sections.css";
import "./stylesheets/Forms.css";

const Signup = ({signup}) => {
    
    const history = useHistory();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({
        first_name: false,
        last_name: false,
        username: false,
        email: false,
        password: false
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData, [name]: value
        }));
    }

    const validateSignup = () => {
        let valid = true;
        setFormErrors({
            first_name: false,
            last_name: false,
            username: false,
            email: false,
            password: false
        })
        if (formData["first_name"].length < 1){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "first_name": true
            }))
        }
        if (formData["last_name"].length < 1){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "last_name": true
            }))
        }
        if (formData["username"].length < 6){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "username": true
            }))
        }
        if (!formData["email"].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "email": true
            }))
        }
        if (formData["password"].length < 8){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "password": true
            }))
        }
        return valid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = validateSignup();
        if (valid) {
            let res = await signup(formData);
            if(res.success){
                history.push("/dashboard")
            }
        }
    }

    return (
        <div className="Signup">
            <div className="section">
                <div className="col-20 col">
                    <div className="card formcard">
                        <h4 className="card-title">Signup</h4>
                        <div className="card-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-s">
                                        <label htmlFor="first_name">First Name</label>
                                        <input 
                                            className={`form-input ${formErrors.first_name ? "input-error" : ""}`}
                                            id="first_name" 
                                            value={formData.first_name} 
                                            onChange={handleChange}
                                            name="first_name"
                                            type="text"
                                        />
                                        {formErrors.first_name ? <span className="form-error">This value is required</span> : null}
                                    </div>
                                    <div className="form-s">
                                        <label htmlFor="last_name">Last Name</label>
                                        <input 
                                            className={`form-input ${formErrors.last_name ? "input-error" : ""}`}
                                            id="last_name" 
                                            value={formData.last_name} 
                                            onChange={handleChange}
                                            name="last_name"
                                            type="text"
                                        />
                                        {formErrors.last_name ? <span className="form-error">This value is required</span> : null}
                                    </div>
                                    <div className="form-s">
                                        <label htmlFor="username">Username</label>
                                        <input 
                                            className={`form-input ${formErrors.username ? "input-error" : ""}`}
                                            id="username" 
                                            value={formData.username} 
                                            onChange={handleChange}
                                            name="username"
                                            type="text"
                                        />
                                        {formErrors.username ? <span className="form-error">Must be 6 or more characters</span> : null}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-s">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            className={`form-input ${formErrors.email ? "input-error" : ""}`}
                                            id="email" 
                                            value={formData.email} 
                                            onChange={handleChange}
                                            name="email"
                                            type="text"
                                        />
                                        {formErrors.email ? <span className="form-error">Invalid email address</span> : null}
                                    </div>
                                    <div className="form-s">
                                        <label htmlFor="password">Password</label>
                                        <input 
                                            className={`form-input ${formErrors.password ? "input-error" : ""}`}
                                            id="password" 
                                            value={formData.password} 
                                            onChange={handleChange}
                                            name="password"
                                            type="password"
                                        />
                                        {formErrors.password ? <span className="form-error">Must be 8 or more characters</span> : null}
                                    </div>
                                </div>
                                <div className="form-row form-button-row">
                                    <button type="submit" className="form-btn">Signup</button><br/>
                                    <span className="form-subtext">
                                        Already signed up? <NavLink className="text-link" exact to="/login">log in</NavLink>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;