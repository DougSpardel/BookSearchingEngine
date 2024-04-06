import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';
import { Container, Col, Form, Button, Card, Row, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [error, setError] = useState('');

  const [saveBook, { loading: savingBook }] = useMutation(SAVE_BOOK, {
    update(cache, { data: { saveBook } }) {
      if (saveBook) {
        setSavedBookIds((prevSavedBookIds) => [...prevSavedBookIds, saveBook.bookId]);
        saveBookIds([...savedBookIds, saveBook.bookId]);
      }
    }
  });

  const searchBooks = async () => {
    setError('');
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
      if (!response.ok) {
        throw new Error('Google Books API failed to fetch data.');
      }
      const { items } = await response.json();
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));
      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) {
      setError('Please enter a search term.');
      return;
    }
    await searchBooks();
  };

  const handleSaveBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      setError('You must be logged in to save a book.');
      return;
    }
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    try {
      await saveBook({
        variables: { input: bookToSave },
      });
    } catch (e) {
      console.error('Error saving the book:', e);
      setError('Error saving the book.');
    }
  };

  return (
    <>
      <Container className="text-light bg-dark p-5">
        <h1>Search for Books!</h1>
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col xs={12} md={8}>
              <Form.Control
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type='text'
                size='lg'
                placeholder='Search for a book'
              />
            </Col>
            <Col xs={12} md={4}>
              <Button type='submit' variant='success' size='lg'>
                Submit Search
              </Button>
            </Col>
          </Row>
        </Form>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Container>
      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length ? `Viewing ${searchedBooks.length} results:` : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds.includes(book.bookId) || savingBook}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds.includes(book.bookId) ? 'Saved' : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
