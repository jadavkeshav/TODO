const BASE_URL = 'https://todotracker.vercel.app/';
async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  if (taskInput.value.trim() === '') {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/addTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: taskInput.value,
      }),
    });

    const newTask = await response.json();

    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-id', newTask._id);
    taskItem.innerHTML = `
      <input type="checkbox" onchange="toggleTaskStatus(this)">
      <span>${newTask.description}</span>
      <button class="delete-btn" onclick="deleteTask('${newTask._id}')">Delete</button>
    `;

    taskList.appendChild(taskItem);
    taskInput.value = '';
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

function toggleTaskStatus(checkbox) {
  const taskItem = checkbox.parentNode;
  taskItem.classList.toggle('completed');
}

async function deleteTask(taskId) {
  try {
    await fetch(`${BASE_URL}/deleteTask/${taskId}`, {
      method: 'DELETE',
    });

    // Remove the task from the UI
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    taskItem.remove();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

window.onload = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getTasks`);
    const tasks = await response.json();

    const taskList = document.getElementById('taskList');

    tasks.forEach((task) => {
      const taskItem = document.createElement('li');
      taskItem.setAttribute('data-id', task._id);
      taskItem.innerHTML = `
        <input type="checkbox" onchange="toggleTaskStatus(this)" ${task.completed ? 'checked' : ''}>
        <span>${task.description}</span>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
      `;

      taskList.appendChild(taskItem);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};
