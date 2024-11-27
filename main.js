// Inisialisasi form dan elemen
const bookForm = document.getElementById('bookForm');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

let editMode = false;
let editBookId = null;

// Event Listener untuk form tambah atau edit buku
bookForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;
  const fileInput = document.getElementById('bookFormFile');
  const file = fileInput.files[0]; // Mengambil file yang diunggah

  if (editMode) {
    updateBook(editBookId, title, author, year, isComplete, file);
  } else {
    addBook(title, author, year, isComplete, file);
  }
});

// Fungsi menambahkan buku baru
function addBook(title, author, year, isComplete, file) {
  const id = new Date().getTime();

  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const book = {
        id,
        title,
        author,
        year,
        isComplete,
        fileData: reader.result,
        fileName: file.name,
      };
      saveBook(book);
      bookForm.reset();
    };
  } else {
    alert('Silakan unggah file buku.');
  }
}

// Fungsi memperbarui buku yang ada
function updateBook(bookId, title, author, year, isComplete, file) {
  let books = JSON.parse(localStorage.getItem('books')) || [];

  books = books.map((book) => {
    if (book.id === bookId) {
      book.title = title;
      book.author = author;
      book.year = year;
      book.isComplete = isComplete;

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          book.fileData = reader.result;
          book.fileName = file.name;
          localStorage.setItem('books', JSON.stringify(books));
          displayBooks();
        };
      } else {
        return book;
      }
    }
    return book;
  });

  localStorage.setItem('books', JSON.stringify(books));
  displayBooks();
  bookForm.reset();
  editMode = false;
  editBookId = null;
}

// Fungsi menyimpan buku
function saveBook(book) {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
  displayBooks();
}

// Fungsi menampilkan buku
function displayBooks() {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const books = JSON.parse(localStorage.getItem('books')) || [];

  books.forEach((book) => {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <a href="${book.fileData}" target="_blank">Buka Buku (${book.fileName})</a>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai' : 'Selesai'} dibaca</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    // Event untuk memindahkan buku antar rak
    bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', function () {
      toggleBookStatus(book.id);
    });

    // Event untuk mengedit buku
    bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', function () {
      startEditBook(book);
    });

    // Event untuk menghapus buku
    bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', function () {
      deleteBook(book.id);
    });

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Fungsi memulai proses edit buku
function startEditBook(book) {
  document.getElementById('bookFormTitle').value = book.title;
  document.getElementById('bookFormAuthor').value = book.author;
  document.getElementById('bookFormYear').value = book.year;
  document.getElementById('bookFormIsComplete').checked = book.isComplete;

  editMode = true;
  editBookId = book.id;
}

// Fungsi memindahkan buku antar rak
function toggleBookStatus(bookId) {
  let books = JSON.parse(localStorage.getItem('books')) || [];
  books = books.map((book) => {
    if (book.id === bookId) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });
  localStorage.setItem('books', JSON.stringify(books));
  displayBooks();
}

// Fungsi menghapus buku
function deleteBook(bookId) {
  let books = JSON.parse(localStorage.getItem('books')) || [];
  books = books.filter((book) => book.id !== bookId);
  localStorage.setItem('books', JSON.stringify(books));
  displayBooks();
}

// Inisialisasi tampilan awal
displayBooks();
