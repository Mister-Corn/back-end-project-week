// Dependencies
import React from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
// Components
import { fetchNotes, deleteNote, shareNote, clearError } from '../Actions';
import { Button } from '../Button';
import { Form, Input } from 'semantic-ui-react';
// CSS
import './ViewNote.css';

const cssMakesMeCry = {
  color: `var(--color-bg--button-main)`,
  fontFamily: `'Roboto', sans-serif`,
  textDecoration: `underline`,
};


class ViewNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      modalA: false,
      modalB: false,
      modalC: false,
      go: false,
      loading: false,
      error: false,
    }
  }

  componentDidMount = async () => {
    // console.log("Does this.props.user exist? ",this.props.user ? "YES":"NO");
    if (this.props.user) {
      this.setState({ loading: true });
      // this.props.fetchTheme(this.props.user.uid);
      await this.props.fetchNotes(this.props.user.uid);

      if (this.props.error) {
        this.setState({ error: true, loading: false });
      } else {
        this.props.clearError();
        this.setState({ error: false, loading: false });
      }
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  inputSpitter = (name, type="text", handler=this.handleInputChange) => {
    return <Input 
      type={type} 
      name={name} 
      value= {this.state[name]} 
      onChange={handler}
    />;
  }

  toggle = (e) => {
    e.preventDefault();
    this.setState({
      modalA: !this.state.modalA
    });
    this.props.clearError();
  }

  toggleShare = (e) => {
    if (e) e.preventDefault();
    this.setState({
      modalB: !this.state.modalB
    });
    this.props.clearError();
  }

  toggleUnshare = (email = "") => {
    const toSend = this.state.modalC ? "" : email;
    console.log("toSend:",toSend);
    this.setState({
      email: toSend,
      modalC: !this.state.modalC
    });
    this.props.clearError();
  }

  deleteMethod = async (e) => {
    e.preventDefault();
    await this.props.deleteNote(this.props.user.uid, this.props.id);
    if (this.props.error) {
      console.log("ERROR:",this.props.error);
    } else {
      this.setState({
        email: '',
        modalA: false,
        modalB: false,
        modalC: false,
        go: true,
      });
      this.props.clearError();
    }
  }

  shareMethod = async (event) => {
    event.preventDefault();
    const infoObj = {
      "email": this.state.email,
      "share": true
    }
    console.log('this.props.user.uid',this.props.user.uid,'this.props.id',this.props.id);
    await this.props.shareNote(this.props.user.uid, this.props.id, infoObj);
    console.log('made it to line 83');
    if (this.props.error) {
      console.log("ERROR:",this.props.error);
    } else {
      this.setState({ email: '' });
      this.toggleShare();
    }
  }

  unshareMethod = async (event) => {
    event.preventDefault();
    const infoObj = {
      "email": this.state.email,
      "share": false
    }
    // console.log(event);
    // console.log('this.props.user.uid',this.props.user.uid,'this.props.id',this.props.id);
    await this.props.shareNote(this.props.user.uid, this.props.id, infoObj);
    console.log('made it to line 83');
    if (this.props.error) {
      console.log("ERROR:",this.props.error);
    } else {
      this.setState({ email: '' });
      this.toggleUnshare();
    }
  }

  render() {
    // Are you even logged in?
    if (!this.props.user) return <Redirect to ="/" />;
    // Did you just delete something? Go back to the list.
    if (this.state.go === true) return <Redirect to="/notes" />;
    // Some variable management
    const note = this.props.notes.filter(note => note._id === this.props.id)[0];
    const { title, text, tags, collaborators } = note; 
    console.log("ViewNote.js tags",tags);

    return (
      <div style={{background: "var(--color-bg--main)", height: "100%"}} className="pr-3">
      {/* Delete Modal */}
        <Modal isOpen={this.state.modalA} toggle={this.toggle} className={this.props.className}>
          <ModalBody>
            <h5 className="text-center">Are you sure you want to delete this?</h5>
            {
              this.props.error &&
              <p style={{"color":"red"}}><u>Error</u><br/>
              {this.props.error.response.status}: {this.props.error.response.statusText}</p>
            }
          </ModalBody>
          <ModalFooter>
            <Button delete onClick={this.deleteMethod}>Delete</Button>{' '}
            <Button onClick={this.toggle}>No</Button>
          </ModalFooter>
        </Modal>
      {/* End of Delete Modal */}
      {/* Share Modal */}
        <Modal isOpen={this.state.modalB} toggle={this.toggleShare} className={this.props.className}>
          <ModalBody>
            <h5 className="text-center">Enter the email of the user you want to share the note with.</h5>
            {
              this.props.error &&
              <p style={{"color":"red"}}><u>Error</u><br/>
              {this.props.error.response.status}: {this.props.error.response.statusText}</p>
            }
            <Form onSubmit={this.shareMethod}>
                <Form.Field>
                  <label>E-mail</label>
                  {this.inputSpitter('email')}
                </Form.Field>
                <Button>Submit</Button>
              </Form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.toggleShare}>Cancel</Button>
          </ModalFooter>
        </Modal>
      {/* End of Share Modal */}
      {/* Unshare Modal */}
        <Modal isOpen={this.state.modalC} toggle={this.toggleUnshare} className={this.props.className}>
          <ModalBody>
          <h5 className="text-center">Are you sure you want to no longer share this note?</h5>
          </ModalBody>
          <ModalFooter>
          <Button delete onClick={this.unshareMethod}>Unshare</Button>{' '}
            <Button onClick={this.toggleUnshare}>Cancel</Button>
          </ModalFooter>
        </Modal>
      {/* End of UnShare Modal */}
        <div className="actions d-flex pt-3 justify-content-end">
          <Link style={cssMakesMeCry} to={`/notes/edit/${this.props.id}`} className="mx-2">edit</Link>
          <a style={cssMakesMeCry} href="" onClick={this.toggleShare} className="mx-2">share</a>
          <a style={cssMakesMeCry} href="" onClick={this.toggle} className="mx-2">delete</a>
        </div>
        <div className="view-note p-4">
          <h3>{title}</h3>
          <hr style={{borderColor:'var(--color--main)'}} />
          <div className="mt-2 mb-3">
            { 
              tags.length > 0 ? 
              tags.map((tag, i) => <Link to={`/notes/tag/${tag}`}><Tag key={i}>{tag}</Tag></Link>) 
              : 
              <p><em>No tags</em></p> 
            }
          </div>
          <br />
          <ReactMarkdown source={text} />
          <hr style={{borderColor:'var(--color--main)'}} />
            <h6>Users you're sharing this note with:</h6>
            {
              collaborators.length > 0 ? 
              collaborators.map(user => <Button onClick={() => this.toggleUnshare(user.email)} email={user.email} style={{"width":"auto"}}>{user.email}</Button>)
              :
              <p><em>No collaborators</em></p>
            }
        </div>
      </div>
    );
  }
}

export const Tag = styled.button`
  /* colors */
  background-color: var(--color-bg--button-main);
  color: var(--color--button);
  /* sizing */
  height: 26px;
  /* box model */
  margin: 0 0.3rem;
  border: 0.5px solid var(--color-border);
  border-radius: 6px;
  border-collapse: collapse;
  /* text */
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
`;

const mapDispatchToProps = state => {
  return {
    notes: state.notesReducer.notes,
    user: state.userReducer.user,
    error: state.userReducer.error
  };
};

export default withRouter(connect(mapDispatchToProps, { fetchNotes, deleteNote, shareNote, clearError })(ViewNote));