document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login');
    const registerButton = document.getElementById('register');
    const form = document.querySelector('.form');

    // Функция для отправки запросов на сервер
    async function sendRequest(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Если сервер вернул токен напрямую (без JSON)
            const responseText = await response.text();
            return responseText;
        } catch (error) {
            console.error('Request error:', error);
            alert('Error: ' + error.message);
            throw error;
        }
    }

    // Обработчик для регистрации
    registerButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Предотвращаем стандартное действие кнопки

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('Please fill in both fields');
            return;
        }

        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.status === 201) {
                alert('User registered successfully!');
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        }
    });

    // Обработчик для входа в систему
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Предотвращаем стандартное действие формы

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('Please fill in both fields');
            return;
        }

        try {
            const token = await sendRequest('/api/user/login', { username, password });

            if (token) {
                localStorage.setItem('jwtToken', token);
                alert('Login successful! Redirecting...');
                window.location.href = '/'; // Перенаправление на главную страницу
            } else {
                alert('Login failed. Invalid credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    // Функция проверки авторизации пользователя
    function checkAuth() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            console.log('User is logged in, token:', token);
            window.location.href = '/'; // Если пользователь авторизован, перенаправляем
        } else {
            console.log('User is not logged in.');
        }
    }

    // Проверка токена при загрузке страницы
    checkAuth();
});
