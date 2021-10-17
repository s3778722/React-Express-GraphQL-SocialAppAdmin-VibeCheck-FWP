import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { updateUser } from "../data/repository";

const PopupForm = (props) => {
  const findSelectedUser = () => {
    return props.users.find((u) => u.email === props.currentEmail);
  };

  //useState hook for showing the modal popup
  const [show, setShow] = useState(false);

  //event handler to close the modal pop up
  const handleClose = () => setShow(false);

  //event handler to show the modal pop up
  const handleShow = (event) => {
    setShow(true);
    setAlertMessage(null);
  };
  //useState hook for the form fields
  const [fields, setFields] = useState({
    name: findSelectedUser().name,
    email: findSelectedUser().email,
    password: findSelectedUser().password_hash,
  });

  //useState hook for the alert message
  const [alertMessage, setAlertMessage] = useState(null);

  //useState hook for the determining the type of the alert message
  const [success, setSuccess] = useState(false);

  //event handler for the input change of the form
  const handleInputChange = (e) => {
    //field name
    const name = e.target.name;
    //field value
    const value = e.target.value;

    const inputFields = { ...fields };
    inputFields[name] = value;

    //set the new input fields data
    setFields(inputFields);
  };

  //get the users from the local storage by parsing the JSON format

  //password regex to validate the correct format:
  //at least six characters and should be a mix of uppercase and lowercase characters, numbers and special characters.
  const passwordRegex = new RegExp(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-!@#$%^&*()_+|~=`{}[\]:";'<>?,./]).{6,}$/
  );
  const trimFields = () => {
    const trimmedFields = {};
    Object.keys(fields).map((key) => {
      if (fields[key] !== null) {
        return (trimmedFields[key] = fields[key].trim());
      } else {
        return (trimmedFields[key] = fields[key]);
      }
    });
    setFields(trimmedFields);

    return trimmedFields;
  };

  //event handler for submit button
  const handleSubmit = async (event) => {
    //prevent the default event from occuring
    event.preventDefault();

    const trimmedFields = trimFields();

    //if users is null, return empty array
    /*
    if (users === null) {
      users = [];
    }*/

    //if fields are empty, prompt to fill in.
    if (
      !trimmedFields.name ||
      !trimmedFields.email ||
      !trimmedFields.password
    ) {
      const emptyFieldsMessage = "Please fill in all the necessary fields";
      setAlertMessage(emptyFieldsMessage);
      alert(emptyFieldsMessage);
      setSuccess(false);
    } else if (trimmedFields.name.length > 64) {
      const emptyFieldsMessage = "Max length of name is 64 characters";
      setAlertMessage(emptyFieldsMessage);
      alert(emptyFieldsMessage);
      setSuccess(false);
    } else if (trimmedFields.password.length > 96) {
      const emptyFieldsMessage = "Max length of password is 96 characters";
      setAlertMessage(emptyFieldsMessage);
      alert(emptyFieldsMessage);
      setSuccess(false);
    } else if (
      !fields.password === findSelectedUser().password_hash ||
      !passwordRegex.test(fields.password)
    ) {
      //check if it pass the password regex validation
      setAlertMessage(
        "Invalid password format: the password must be at least six characters and should be a mix of uppercase and lowercase characters, numbers and special characters."
      );
      alert("Invalid password format");
      setSuccess(false);
    } else {
      const updatedUser = await updateUser(trimmedFields);

      const newList = [...props.users];

      newList.forEach((u) => {
        if (u.email === props.currentEmail) {
          u.name = updatedUser.name;
          u.password_hash = updatedUser.password_hash;
        }
      });
      const newFields = { ...fields };
      newFields.name = updatedUser.name;
      newFields.password = updatedUser.password_hash;
      setFields(newFields);
      props.setUsers(newList);

      const messageSuccess = "Edit is saved.";
      setAlertMessage(messageSuccess);
      alert(messageSuccess);
      setSuccess(true);
    }
  };

  //function to determining the alert message type and message content
  const showAlertMessage = (message) => {
    if (message) {
      if (success) {
        return (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        );
      } else {
        return (
          <div className="alert alert-warning" role="alert">
            {message}
          </div>
        );
      }
    }
  };

  return (
    <>
      <Button variant="outline-warning" size="sm" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        {showAlertMessage(alertMessage)}
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Please enter your name"
                className="form-control mb-3"
                onChange={handleInputChange}
                value={fields.name}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Please enter your email address"
                className="form-control mb-3"
                onChange={handleInputChange}
                value={fields.email}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-control-label text-muted">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Please enter your password"
                className="form-control mb-4"
                onChange={handleInputChange}
                value={fields.password}
                required
              />
            </div>
            <div className="row justify-content-center my-3 px-3">
              <button className="btn btn-blue-left" type="submit">
                Save changes
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PopupForm;
