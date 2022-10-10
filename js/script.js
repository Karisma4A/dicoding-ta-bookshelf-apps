const todos = [];
const RENDER_EVENT = 'render-book';

// fungsi generate ID date
function generateId() {
  return +new Date();
}

// fungsi generate object
function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function findTodo(bookId) {
  for (const bookItem of todos) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in todos) {
    if (todos[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(todoObject) {

  const { id, title, author, year, isCompleted } = todoObject;

  const textJudul = document.createElement('h2');
  textJudul.innerText = todoObject.title;

  const textPenulis = document.createElement('p');
  textPenulis.innerText = 'Penulis: ' + todoObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun: ' + todoObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textJudul, textPenulis, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {

    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button'), undoButton.innerText = 'Belum Selesai Dibaca';
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button'), trashButton.innerText = 'Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button'), checkButton.innerText = 'Selesai Dibaca';
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button'), trashButton.innerText = 'Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }
  return container;
}

function addTodo() {
  const textJudul = document.getElementById('title').value;
  const textPenulis = document.getElementById('author').value;
  const year = document.getElementById('year').value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textJudul, textPenulis, year, false);
  todos.push(todoObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId /* HTMLELement */) {

  const todoTarget = findTodo(bookId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId /* HTMLELement */) {
  const todoTarget = findBookIndex(bookId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId /* HTMLELement */) {
  const todoTarget = findTodo(bookId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});


document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('books');
  const listCompleted = document.getElementById('completed-books');

  // clearing list item
  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of todos) {
    const todoElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-book ';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}