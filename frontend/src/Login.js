import React, {useState} from "react";
import { NavLink, useHistory } from 'react-router-dom';
import "./stylesheets/Sections.css";
import "./stylesheets/Forms.css";

const Login = ({login, guestlogin}) => {
    const history = useHistory();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({
        username: false,
        password: false
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
            ...formData, [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = validateLogin();
        if (valid) {
            let res = await login(formData);
            if(res.success){
                history.push("/dashboard");
            } else {}
        }
    }

    const guestLogin = async (e) => {
        e.preventDefault()
        let res = await guestlogin();
        if(res.success){
            history.push("/dashboard");
        } else {}
    }

    const validateLogin = () => {
        let valid = true;
        setFormErrors({
            username: false,
            password: false
        });
        if (formData["username"].length < 6){
            valid = false;
            setFormErrors(formErrors => ({
                ...formErrors, "username": true
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

    return (
        <div className="Login">
            <div className="section">
                <div className="col-20 col">
                    <div className="card formcard">
                        <h4 className="card-title">Login</h4>
                        <div className="card-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-row">
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
                                        {formErrors.username ? <span className="form-error">Invalid Username</span> : null}
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
                                        {formErrors.password ? <span className="form-error">Invalid Password</span> : null}
                                    </div>
                                </div> 
                                <div className="form-row form-button-row">
                                    <button type="submit" className="form-btn">Login</button>
                                    <button onClick={(e) => guestLogin(e)} className="form-btn form-guest">Continue As Guest</button><br/>
                                    <span className="form-subtext">
                                        Not signed up? <NavLink className="text-link" exact to="/signup">signup</NavLink>
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

export default Login;