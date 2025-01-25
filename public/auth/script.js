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
                body: JSON.stringify(data),
                credentials: 'include'  // Включаем отправку cookies
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            return response.json();
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
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (response.ok) {
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
            const response = await sendRequest('/api/user/login', { username, password });

            alert('Login successful! Redirecting...');
            window.location.href = '/';  // Перенаправление на главную страницу
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    // Функция проверки авторизации пользователя через cookies
    async function checkAuth() {
        try {
            const response = await fetch('/api/user/check', {
                method: 'GET',
                credentials: 'include'  // Передаем cookies на сервер
            });

            if (response.ok) {
                console.log('User is logged in');
                window.location.href = '/';  // Перенаправляем авторизованного пользователя
            }
        } catch (error) {
            console.log('User is not logged in.');
        }
    }

    // Проверка авторизации при загрузке страницы
    checkAuth();
});
