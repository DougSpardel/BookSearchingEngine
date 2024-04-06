import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER, {
    onCompleted: (data) => {
      Auth.login(data.addUser.token); // Login user with the new token
      setUserFormData({ username: '', email: '', password: '' }); // Reset form
      setShowAlert(false); // Hide alert if shown
    },
    onError: (addUserError) => {
      console.error("Signup error", addUserError);
      setShowAlert(true); // Show error alert
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
    if (showAlert) setShowAlert(false); // Hide alert on input change
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userFormData.username || !userFormData.email || !userFormData.password) {
      setShowAlert(true); // Show alert if form is incomplete
      return;
    }

    await addUser({ variables: { ...userFormData } });
  };

  return (
    <>
      <Form noValidate onSubmit={handleFormSubmit}>
        {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          {error ? `Error: ${error.message}` : 'Something went wrong with your signup!'}
        </Alert>}

        <Form.Group controlId="signup-username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={userFormData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="signup-email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={userFormData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="signup-password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={userFormData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" disabled={!userFormData.username || !userFormData.email || !userFormData.password}>
          Sign Up
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
