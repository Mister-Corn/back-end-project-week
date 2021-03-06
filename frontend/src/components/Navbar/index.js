// Dependencies
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadToken } from '../../config/localStorage';
// Redux actions
import { sendToken, loginUser, logoutUser, fetchTheme } from '../Actions';
// Components
import { Button, RLink } from '../Button';
// CSS
import './Navbar.css';

class Navbar extends Component {

    componentDidMount = () => {
        const token = loadToken();
        if (token !== undefined) {
            this.props.sendToken(token);
        }
    }

    render = () => {
        const { classes } = this.props;
        return (
            <div className={`navbar ${classes}`}>
                <h1>Lambda<br/>Notes</h1>
                { this.props.user ?
                    (<Fragment>
                        {/* <div className="w-100">
                            <img className="d-block img-fluid rounded-circle mx-auto" src={this.props.user.photoURL} />
                            <h3 style={{fontSize:"16px"}} className="m-2 text-center">{this.props.user.displayName}</h3>
                        </div> */}
                        <RLink className="mt-2" to="/notes"><Button>View Your Notes</Button></RLink>
                        <RLink className="my-2" to="/notes/new"><Button>+ Create New Note</Button></RLink>
                        <div className="button-div d-flex flex-nowrap justify-content-between w-100">
                            <RLink style={{width:`48%`}} className="" to="/user/styles"><Button><i className="fas fa-paint-brush"></i></Button></RLink>
                            <Button style={{width:`48%`}} onClick={this.props.logoutUser}><i className="fas fa-door-open"></i></Button>
                        </div>
                    </Fragment>)
                    :
                    <Fragment>
                        <Button className="my-2" onClick={() => this.props.history.push('/login')}>Log In</Button>
                        <Button className="my-2" onClick={() => this.props.history.push('/register')}>Register</Button>
                    </Fragment>
                }   
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
    }
};

export default withRouter(connect(mapStateToProps, { sendToken, loginUser, logoutUser, fetchTheme })(Navbar));