const bookShelf = [];
const STORAGE_KEY = 'RAK_BUKU_APPS';
const RENDER_EVENT = 'render-shelf'

// EVENT
document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();

        document.getElementById('inputBookTitle').value = "";
        document.getElementById('inputBookAuthor').value = "";
        document.getElementById('inputBookYear').value = "";
    })

    if (isStorageExist()) {
        loadData();
    }
});

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookShelf = document.getElementById('incompleteBookshelfList');
    const completedBookShelf = document.getElementById('completeBookshelfList');
    uncompletedBookShelf.innerHTML = '';
    completedBookShelf.innerHTML = '';

    for (const bookItem of bookShelf) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookShelf.append(bookElement);
        } else {
            completedBookShelf.append(bookElement);
        }
    }
});

document.getElementById('inputBookIsComplete').addEventListener('click', function() {
    const submitText = document.getElementById('submitText');
    if (submitText.innerText == 'Belum selesai dibaca') {
        submitText.innerText = 'Selesai di baca';
    } else {
        submitText.innerText = 'Belum selesai dibaca';
    }
    
});

document.getElementById('searchBook').addEventListener('submit', function(searchEvent) {
    searchEvent.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const titleBooks = document.querySelectorAll('.book_item > h3');
    for (book of titleBooks) {
        if (searchBook === ''){
            book.parentElement.style.display = 'block';
        } else if (book.innerText.toLowerCase().includes(searchBook)){
            book.parentElement.style.display = 'block';
        } else if (!book.innerText.toLowerCase().split(' ').includes(searchBook)) {
            book.parentElement.style.display = 'none';
        } else {
            book.parentElement.style.display = 'block';
        }
    }
});

// fungsi storage
function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadData() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            bookShelf.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookShelf);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function generatedID() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    }
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + bookObject.year;

    const container = document.createElement('div');
    container.classList.add('action');

    if (!bookObject.isCompleted) {
       const completedButton = document.createElement('button');
       completedButton.classList.add('green');
       completedButton.innerText = 'Selesai dibaca';
       completedButton.addEventListener('click', function() {
        markBookCompleted(bookObject.id);
       });

       const removeButton = document.createElement('button');
       removeButton.classList.add('red');
       removeButton.innerText = 'Hapus buku';
       removeButton.addEventListener('click', function() {
        removeBookFromShelf(bookObject.id);
       });

       container.append(completedButton, removeButton);
    } else {
        const uncompletedButton = document.createElement('button');
        uncompletedButton.classList.add('green');
        uncompletedButton.innerText = 'Belum selesai dibaca';
        uncompletedButton.addEventListener('click', function() {
         markBookUncompleted(bookObject.id);
        });
 
        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus buku';
        removeButton.addEventListener('click', function() {
         removeBookFromShelf(bookObject.id);
        });

        container.append(uncompletedButton, removeButton);
    }

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear, container);

    return article;
}

function addBook() {
    const IDBook = generatedID();
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const isCompletedBook = document.getElementById('inputBookIsComplete').checked;

    const bookObject = generateBookObject(IDBook, titleBook, authorBook, yearBook,isCompletedBook);
    bookShelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function markBookCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function markBookUncompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromShelf(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    bookShelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of bookShelf) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in bookShelf) {
        if (bookShelf[index].id === bookId) {
            return index;
        }
    }
    return -1;
}