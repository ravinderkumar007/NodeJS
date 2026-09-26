
import express from "express";

const app = express();

const PORT = 3000;

// =====================================================
// Dummy Book Data
// =====================================================

const books = [
    {
        id: 1,
        title: "Book One",
        author: "Author A",
        genre: "Fiction"
    },
    {
        id: 2,
        title: "Book Two",
        author: "Author B",
        genre: "Non-Fiction"
    },
    {
        id: 3,
        title: "Book Three",
        author: "Author A",
        genre: "Mystery"
    }
];

// =====================================================
// Dummy User Data
// =====================================================

const users = [
    {
        id: 1,
        name: "User One",
        borrowedBooks: [1, 3]
    },
    {
        id: 2,
        name: "User Two",
        borrowedBooks: [2]
    }
];


// =====================================================
// ROUTE 1
// Get all books when bookId is not provided
//
// GET /books
// =====================================================

app.get("/books", (req, res) => {

    res.json({
        message: "No Book ID Provided"
    });

});


// =====================================================
// ROUTE 2
// Get a specific book
//
// GET /books/:bookId
// Example: /books/1
// =====================================================

app.get("/books/:bookId", (req, res) => {

    const { bookId } = req.params;

    // Validate bookId
    if (isNaN(bookId)) {
        return res.status(400).json({
            error: "Book ID must be a number"
        });
    }

    const id = Number(bookId);

    // Find book
    const book = books.find(book => book.id === id);

    // Book not found
    if (!book) {
        return res.status(404).json({
            error: "Book not found"
        });
    }

    res.json(book);

});


// =====================================================
// ROUTE 3
// Search books using query strings
//
// GET /search
// GET /search?author=Author%20A
// GET /search?genre=Mystery
// GET /search?author=Author%20A&genre=Mystery
// =====================================================

app.get("/search", (req, res) => {

    const { author, genre } = req.query;

    let result = books;

    // Filter by author
    if (author) {

        result = result.filter(book =>
            book.author.toLowerCase() === author.toLowerCase()
        );

    }

    // Filter by genre
    if (genre) {

        result = result.filter(book =>
            book.genre.toLowerCase() === genre.toLowerCase()
        );

    }

    res.json({
        count: result.length,
        books: result
    });

});


// =====================================================
// ROUTE 4
// Get all books borrowed by a user
//
// GET /users/:userId/books
// Example: /users/1/books
// =====================================================

app.get("/users/:userId/books", (req, res) => {

    const { userId } = req.params;

    // Validate userId
    if (isNaN(userId)) {

        return res.status(400).json({
            error: "User ID must be a number"
        });

    }

    const id = Number(userId);

    // Find user
    const user = users.find(user => user.id === id);

    // User not found
    if (!user) {

        return res.status(404).json({
            error: "User not found"
        });

    }

    // Find all borrowed books
    const borrowedBooks = books.filter(book =>
        user.borrowedBooks.includes(book.id)
    );

    res.json({
        user: user.name,
        borrowedBooks: borrowedBooks
    });

});


// =====================================================
// ROUTE 5
// Get a specific book borrowed by a user
//
// GET /users/:userId/books/:bookId
// Example: /users/1/books/3
// =====================================================

app.get("/users/:userId/books/:bookId", (req, res) => {

    const { userId, bookId } = req.params;

    // Validate userId
    if (isNaN(userId)) {

        return res.status(400).json({
            error: "User ID must be a number"
        });

    }

    // Validate bookId
    if (isNaN(bookId)) {

        return res.status(400).json({
            error: "Book ID must be a number"
        });

    }

    const userIdNumber = Number(userId);
    const bookIdNumber = Number(bookId);

    // Find user
    const user = users.find(user => user.id === userIdNumber);

    if (!user) {

        return res.status(404).json({
            error: "User not found"
        });

    }

    // Check whether the user borrowed this book
    if (!user.borrowedBooks.includes(bookIdNumber)) {

        return res.status(404).json({
            error: "This user has not borrowed this book"
        });

    }

    // Find book
    const book = books.find(book => book.id === bookIdNumber);

    if (!book) {

        return res.status(404).json({
            error: "Book not found"
        });

    }

    res.json({
        user: user.name,
        book: book
    });

});


// =====================================================
// ROUTE 6
// Handle invalid routes
// =====================================================

app.use((req, res) => {

    res.status(404).json({
        error: "Route not found"
    });

});


// =====================================================
// Start Server
// =====================================================

app.listen(PORT, () => {

    console.log(
        `Library App running at http://localhost:${PORT}`
    );

});
