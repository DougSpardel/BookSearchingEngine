# Book Searching Engine

## Description

The Book Searching Engine is a full-stack application that allows users to search for books via the Google Books API, save their favorite books, and manage their saved collection. Built with a MERN stack (MongoDB, Express.js, React.js, and Node.js), it integrates GraphQL for efficient data fetching and manipulation, providing a seamless user experience.

## Features

- User Authentication (Login/Signup)
- Book Search using Google Books API
- Save Favorite Books
- View and Manage Saved Books

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- GraphQL
- Apollo Server
- React Bootstrap for styling

## Installation

To set up the Book Searching Engine locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone 
    ```

2. Navigate to the project directory:
    ```bash
    cd BookSearchingEngine
    ```

3. Install dependencies for both server and client:
    ```bash
    # Install server dependencies
    npm install
    
    # Navigate to the client directory
    cd client
    
    # Install client dependencies
    npm install
    
    # Return to the root directory
    cd ..
    ```

4. Configure environment variables:
    - Create a `.env` file in the server directory.
    - Add your MongoDB URI, JWT secret, and any other environment-specific variables.

5. Start the server and client concurrently:
    ```bash
    npm run develop
    ```
    This command will start both the backend server and the frontend client.

## Usage

After installation, access the Book Searching Engine at [http://localhost:3000](http://localhost:3000) (or the port specified in your environment variables).

- **Sign Up/Log In**: To save books, you must create an account or log in.
- **Search Books**: Enter a book title, author, or keywords to search.
- **Save Books**: Click on "Save this Book!" to add a book to your collection.
- **View Saved Books**: Access your saved books from the "Saved Books" page.

## Contributing

Contributions to the Book Searching Engine are welcome! 

## License

Distributed under the MIT License. See `LICENSE` for more information.

