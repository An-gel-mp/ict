import "bootstrap/dist/css/bootstrap.min.css";
import AddBookForm from "./components/AddBookForm";
import BookList from "./components/BookList";

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📚 Book Inventory</h1>
      <AddBookForm />
      <BookList />
    </div>
  );
}

export default App;
