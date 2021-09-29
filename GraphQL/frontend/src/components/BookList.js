import React, { useState } from "react";
import { graphql } from "react-apollo";
import { getBooksQuery } from "../queries";
import BookDetails from "./BookDetails";

const BookList = (props) => {
  const [selected, setSelected] = useState(null);
  const displayBooks = () => {
    const { data } = props;
    if (data.loading) {
      return <div>Loading Books...</div>;
    } else {
      return data.books.map((book) => {
        return (
          <li key={book.id} onClick={() => setSelected(book.id)}>
            {book.name}
          </li>
        );
      });
    }
  };
  return (
    <div>
      <ul id="book-list">{displayBooks()}</ul>
      <BookDetails bookid={selected} />
    </div>
  );
};

export default graphql(getBooksQuery)(BookList);
