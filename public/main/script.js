document.addEventListener('DOMContentLoaded', async () => {
    const authElement = document.getElementById('auth');
    const profileElement = document.getElementById('profile');
    const adminPanelElement = document.getElementById('admin-panel');
    const userInfoElement = document.getElementById('user-info');

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'GET',
                credentials: 'include'
            });
            window.location.reload();  // Перезагружаем страницу после выхода
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async function checkAuth() {
        try {
            const response = await fetch('/api/user/check', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.status !== 200) {
                throw new Error('You are not authenticated');
            }

            const data = await response.json(); // Получаем имя пользователя
            const username = data.username;

            console.log(username)

            // Создание и добавление надписи с никнеймом
            const usernameLabel = document.createElement('span');
            usernameLabel.textContent = `Hello, ${username}`;
            usernameLabel.style.marginRight = '10px';

            // Создание кнопки logout
            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Logout';
            logoutButton.addEventListener('click', async ()=>{
                await logout()
            });

            // Добавляем элементы в DOM
            userInfoElement.appendChild(usernameLabel);

        } catch (error) {
            console.error('Authentication check failed:', error.message);
        }
    }

    // Обработчики кнопок навигации
    authElement.addEventListener('click', () => {
        window.location.href = "/auth";
    });

    profileElement.addEventListener('click', () => {
        window.location.href = "/profile";
    });

    adminPanelElement.addEventListener('click', () => {
        window.location.href = "/admin-panel";
    });

    await checkAuth();
});
