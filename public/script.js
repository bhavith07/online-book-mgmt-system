const API_URL = '/books';

const bookForm = document.getElementById('book-form');
const formTitle = document.getElementById('form-title');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const priceInput = document.getElementById('price');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const bookList = document.getElementById('book-list');
const messageBox = document.getElementById('message-box');

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  setTimeout(() => {
    messageBox.className = 'message hidden';
  }, 3500);
}


async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch books');
    
    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function renderBooks(books) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.innerHTML = '<tr><td colspan="5" style="text-align:center;">No books available.</td></tr>';
    return;
  }

  books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>₹${book.price.toFixed(2)}</td>
      <td>
        <button class="btn edit-btn" onclick="editBook(${book.id})">Edit</button>
        <button class="btn delete-btn" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    `;
    bookList.appendChild(row);
  });
}

bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = bookIdInput.value;
  const bookData = {
    title: titleInput.value,
    author: authorInput.value,
    price: parseFloat(priceInput.value)
  };

  try {
    let response;
    if (id) {
     
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
    } else {
   
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    showMessage(result.message, 'success');
    resetForm();
    fetchBooks();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});


window.editBook = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const book = await response.json();

    if (!response.ok) {
      throw new Error(book.message || 'Could not load book details');
    }

    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    priceInput.value = book.price;

    formTitle.textContent = `Edit Book (ID: ${book.id})`;
    submitBtn.textContent = 'Update Book';
    cancelBtn.classList.remove('hidden');
  } catch (error) {
    showMessage(error.message, 'error');
  }
};

window.deleteBook = async (id) => {
  if (!confirm('Are you sure you want to delete this book?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete book');
    }

    showMessage(result.message, 'success');
    fetchBooks();
  } catch (error) {
    showMessage(error.message, 'error');
  }
};

function resetForm() {
  bookForm.reset();
  bookIdInput.value = '';
  formTitle.textContent = 'Add New Book';
  submitBtn.textContent = 'Add Book';
  cancelBtn.classList.add('hidden');
}

cancelBtn.addEventListener('click', resetForm);

fetchBooks();
