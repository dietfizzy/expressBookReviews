const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({"username":username,"password":password});
  return res.status(200).json({message: "User successfully registered. Now you can login!"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    // Simulate async operation with Promise
    const booksData = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 100); // Small delay to simulate async operation
    });
    return res.status(200).json(booksData);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    // Simulate async operation with Promise
    const bookData = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 100); // Small delay to simulate async operation
    });
    
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    
    // Simulate async operation with Promise
    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get all keys for the 'books' object
        const bookKeys = Object.keys(books);
        
        // Array to store books by the specified author
        const filteredBooks = [];
        
        // Iterate through the 'books' array & check the author matches
        for (let i = 0; i < bookKeys.length; i++) {
          const bookKey = bookKeys[i];
          const book = books[bookKey];
          
          if (book.author && book.author.toLowerCase() === author.toLowerCase()) {
            filteredBooks.push({
              isbn: bookKey,
              author: book.author,
              title: book.title,
              reviews: book.reviews
            });
          }
        }
        
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("No books found for author: " + author));
        }
      }, 100); // Small delay to simulate async operation
    });
    
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    
    // Simulate async operation with Promise
    const booksByTitle = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get all keys for the 'books' object
        const bookKeys = Object.keys(books);
        
        // Array to store books with the specified title
        const filteredBooks = [];
        
        // Iterate through the 'books' array & check the title matches
        for (let i = 0; i < bookKeys.length; i++) {
          const bookKey = bookKeys[i];
          const book = books[bookKey];
          
          if (book.title && book.title.toLowerCase() === title.toLowerCase()) {
            filteredBooks.push({
              isbn: bookKey,
              author: book.author,
              title: book.title,
              reviews: book.reviews
            });
          }
        }
        
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("No books found for title: " + title));
        }
      }, 100); // Small delay to simulate async operation
    });
    
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    // Simulate async operation with Promise
    const reviews = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if the ISBN exists in the books object
        if (books[isbn]) {
          // Return the reviews for the specified ISBN
          resolve(books[isbn].reviews);
        } else {
          reject(new Error("Book not found"));
        }
      }, 100); // Small delay to simulate async operation
    });
    
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get the list of books available in the shop using Axios with async/await
public_users.get('/axios/books', async function (req, res) {
  try {
    // Using Axios with async/await to make HTTP request to our own API
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json({
      message: "Books retrieved using Axios with async/await",
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books using Axios",
      error: error.message
    });
  }
});

// Task 11: Get book details based on ISBN using Axios with async/await
public_users.get('/axios/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Using Axios with async/await to make HTTP request to our own API
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json({
      message: "Book retrieved using Axios with async/await",
      data: response.data
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "Book not found using Axios",
        error: error.response.data.message
      });
    }
    return res.status(500).json({
      message: "Error fetching book using Axios",
      error: error.message
    });
  }
});

// Task 12: Get book details based on Author using Axios with async/await
public_users.get('/axios/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    // Using Axios with async/await to make HTTP request to our own API
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return res.status(200).json({
      message: "Books by author retrieved using Axios with async/await",
      data: response.data
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "No books found for author using Axios",
        error: error.response.data.message
      });
    }
    return res.status(500).json({
      message: "Error fetching books by author using Axios",
      error: error.message
    });
  }
});

// Task 13: Get book details based on Title using Axios with async/await
public_users.get('/axios/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    // Using Axios with async/await to make HTTP request to our own API
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return res.status(200).json({
      message: "Books by title retrieved using Axios with async/await",
      data: response.data
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "No books found for title using Axios",
        error: error.response.data.message
      });
    }
    return res.status(500).json({
      message: "Error fetching books by title using Axios",
      error: error.message
    });
  }
});

module.exports.general = public_users;
