const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });
});

// fungsi tambah data
function addTodo() {
  const textJudul = document.getElementById('title').value;
  const textPenulis = document.getElementById('author').value;
  const year = document.getElementById('year').value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textJudul, textPenulis, year, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

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

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos);

  const uncompletedTODOList = document.getElementById('todos');
  uncompletedTODOList.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    uncompletedTODOList.append(todoElement);
  }
});

function makeTodo(todoObject) {
  const textJudul = document.createElement('h2');
  textJudul.innerText = todoObject.title;

  const textPenulis = document.createElement('p');
  textPenulis.innerText = 'Penulis: ' + todoObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Penulis: ' + todoObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textJudul, textPenulis, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');

    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', function () {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}