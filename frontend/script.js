const API_URL = 'http://18.218.50.15:5000/api/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const filterInput = document.getElementById('filter-input');
const taskList = document.getElementById('task-list');

let tasks = [];

// Obtener tareas del servidor (READ)
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    console.error('Error al cargar tareas:', err);
  }
}

// Renderizar lista filtrada
function renderTasks(tasksToRender) {
  taskList.innerHTML = '';
  tasksToRender.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <span onclick="toggleTask(${task.id}, ${task.completed})">${task.title}</span>
      <div class="actions">
        <button class="btn-delete" onclick="deleteTask(${task.id})">Eliminar</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Crear tarea (CREATE)
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    taskInput.value = '';
    fetchTasks();
  } catch (err) {
    console.error('Error al agregar tarea:', err);
  }
});

// Cambiar estado completed (UPDATE)
async function toggleTask(id, currentCompleted) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentCompleted })
    });
    fetchTasks();
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
  }
}

// Eliminar tarea (DELETE)
async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  } catch (err) {
    console.error('Error al eliminar tarea:', err);
  }
}

// Filtro en tiempo real
filterInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = tasks.filter(t => t.title.toLowerCase().includes(searchTerm));
  renderTasks(filtered);
});

// Cargar al iniciar
fetchTasks();