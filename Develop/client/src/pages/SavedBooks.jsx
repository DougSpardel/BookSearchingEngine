import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  // Use the Apollo useQuery hook to fetch user data
  const { loading, data, error } = useQuery(GET_ME);
  // Apollo useMutation hook to delete a book
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook: removedBook } }) {
      // Update the cache to remove the deleted book
      cache.modify({
        fields: {
          me(existingMeData, { readField }) {
            return {
              ...existingMeData,
              savedBooks: existingMeData.savedBooks.filter(
                (bookRef) => removedBook.bookId !== readField('bookId', bookRef)
              ),
            };
          },
        },
      });
    },
  });

  // Update local state whenever the Apollo query for user data returns new data
  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      console.error('You must be logged in to delete a book.');
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });
      // Upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>LOADING...</h2>;
  if (error) return `Error! ${error.message}`;

  // Render saved books or a message if no books are saved
  return (
    <>
      <Container fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Container>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => (
            <Col key={book.bookId} md="4">
              <Card border='dark'>
                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors?.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
