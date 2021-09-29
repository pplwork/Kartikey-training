import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div id="main" className="App">
        <h1>My Book List</h1>
        <BookList />
        <AddBook />
      </div>
    </ApolloProvider>
  );
}

export default App;
