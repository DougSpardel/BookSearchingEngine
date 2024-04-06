import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);

  // Apollo useMutation hook to handle user login
  const [login, { error, loading }] = useMutation(LOGIN_USER, {
    onCompleted: ({ login }) => {
      // Log the user in (save the token)
      Auth.login(login.token);
      setUserFormData({ email: '', password: '' }); // Reset the form
      setShowAlert(false); // Close the alert if it's open
    },
    onError: (loginError) => {
      // When there is an error, we display it in an alert
      console.error('Login error', loginError);
      setShowAlert(true);
    }
  });

  // Update the form's state when a user types in the input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({
      ...userFormData,
      [name]: value
    });
  };

  // Submit the form and perform the login mutation
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userFormData.email || !userFormData.password) {
      setShowAlert(true); // If any field is empty, show an alert
      return;
    }

    // If we have all data, try to log in the user
    login({ variables: { ...userFormData } });
  };

  return (
    <Form noValidate onSubmit={handleFormSubmit}>
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          {error ? `Login failed: ${error.message}` : 'Something went wrong! Please try again.'}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="email">
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

      <Form.Group className="mb-3" controlId="password">
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

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Form>
  );
};

export default LoginForm;
// mutation {
//   addUser(username: "testuser", email: "testuser@example.com", password: "Password123") {
//     token
//     user {
//       _id
//       username
//       email
//     }
//   }
// } add this to graphql to test login