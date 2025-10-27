let tasks = [];
let taskId = 0;

function addTask(taskText = null) {
    const input = document.getElementById('taskInput');
    const text = taskText || input.value.trim();

    if (!text) return;

    const task = {
        id: taskId++,
        text: text,
        completed: false
    };

    tasks.push(task);
    renderTasks();
    if (!taskText) input.value = '';
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${task.id})">
                    <span class="todo-text">${task.text}</span>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                `;
        list.appendChild(li);
    });
}

async function generateTasks() {
    const apiKey = "AIzaSyBot9mZqO1faAgK8EO6d4KTxNYWv7jNHGQ"
    const prompt = document.getElementById('aiInput').value.trim();

    if (!apiKey) {
        alert('Please enter your Gemini API key');
        return;
    }

    if (!prompt) {
        alert('Please enter a request for AI');
        return;
    }

    const loading = document.getElementById('aiLoading');
    loading.style.dpislay = 'block';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Create a todo list for: "${prompt}". Return only a numbered list of tasks, one per line, without any additional text or formatting. Maximum 8 tasks.`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            const taskLines = aiResponse.split('\n').filter(line => line.trim());

            taskLines.forEach(line => {
                const cleanTask = line.replace(/^\d+\.?\s*/, '').trim();
                if (cleanTask) {
                    addTask(cleanTask);
                }
            });

            document.getElementById('aiInput').value = '';
        } else {
            alert('Error generating tasks. Please check your API key.');
        }
    } catch (error) {
        alert('Error connecting to Gemini API: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
}

// Allow Enter key to add tasks
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});

document.getElementById('aiInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') generateTasks();
});

 let isOpen = false;

        function toggleChat() {
            const chatWindow = document.getElementById('chatWindow');
            isOpen = !isOpen;
            chatWindow.style.display = isOpen ? 'flex' : 'none';
        }

        function addMessage(text, isUser = false) {
            const messages = document.getElementById('chatMessages');
            const message = document.createElement('div');
            message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            message.textContent = text;
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight;
        }

        function showTyping() {
            const messages = document.getElementById('chatMessages');
            const typing = document.createElement('div');
            typing.className = 'typing';
            typing.id = 'typing';
            typing.textContent = 'AI is typing...';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;
        }

        function hideTyping() {
            const typing = document.getElementById('typing');
            if (typing) typing.remove();
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            addMessage(message, true);
            input.value = '';
            
            const apiKey = "AIzaSyBot9mZqO1faAgK8EO6d4KTxNYWv7jNHGQ";
            if (!apiKey) {
                addMessage('Please enter your Gemini API key first.');
                return;
            }
            
            showTyping();
            
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: message }]
                        }]
                    })
                });
                
                const data = await response.json();
                hideTyping();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    addMessage(aiResponse);
                } else {
                    addMessage('Sorry, I encountered an error. Please check your API key.');
                }
            } catch (error) {
                hideTyping();
                addMessage('Connection error. Please try again.');
            }
        }

        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });