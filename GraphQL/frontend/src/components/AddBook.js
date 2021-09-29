import React, { useState } from "react";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { addBookMutation, getAuthorsQuery, getBooksQuery } from "../queries";

const AddBook = (props) => {
  const [book, setBook] = useState({
    name: "",
    genre: "",
    authorID: "",
  });
  const displayAuthors = () => {
    const { getAuthorsQuery: data } = props;
    if (data.loading) {
      return <option disabled>Loading authors</option>;
    } else {
      return data.authors.map((author) => {
        return (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  };
  const submitForm = (e) => {
    e.preventDefault();
    props.addBookMutation({
      variables: {
        ...book,
      },
      refetchQueries: [{ query: getBooksQuery }],
    });
    setBook({
      name: "",
      genre: "",
      authorID: "",
    });
  };
  return (
    <form id="add-book" onSubmit={submitForm}>
      <div className="field">
        <label>Book name:</label>
        <input
          type="text"
          value={book.name}
          onChange={(e) =>
            setBook((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>
      <div className="field">
        <label>Genre:</label>
        <input
          type="text"
          value={book.genre}
          onChange={(e) =>
            setBook((prev) => ({ ...prev, genre: e.target.value }))
          }
        />
      </div>
      <div className="field">
        <label>Author:</label>
        <select
          value={book.authorID}
          onChange={(e) =>
            setBook((prev) => ({ ...prev, authorID: e.target.value }))
          }
        >
          <option>Select author</option>
          {displayAuthors()}
        </select>
      </div>
      <button>+</button>
    </form>
  );
};

export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
