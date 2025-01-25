// Получение имени пользователя и списка записей с сервера
async function fetchUserProfile() {
  try {
      const response = await fetch('/api/user/check', {
          method: 'GET',
          credentials: 'include' // Включаем cookie
      });

      if (!response.ok) {
          throw new Error('Не удалось получить данные пользователя');
      }

      const userData = await response.json();
      document.getElementById("username").textContent = userData.username;

      await fetchAppointments();
  } catch (error) {
      console.error(error);
      alert('Ошибка при загрузке профиля');
  }
}

// Получение списка записей
async function fetchAppointments() {
  try {
      const response = await fetch('/api/record', {
          method: 'GET',
          credentials: 'include' // Включаем cookie для авторизации
      });

      if (!response.ok) {
          throw new Error('Не удалось получить список записей');
      }

      const appointments = await response.json();
      renderAppointments(appointments);
  } catch (error) {
      console.error(error);
      alert('Ошибка при загрузке записей');
  }
}

// Функция отрисовки записей
function renderAppointments(appointments) {
  const appointmentsList = document.getElementById("appointmentsList");
  appointmentsList.innerHTML = '';

  if (appointments.length === 0) {
      appointmentsList.innerHTML = '<p>Записей пока нет</p>';
      return;
  }

  appointments.forEach((appointment) => {
      const card = document.createElement("div");
      card.classList.add("appointment-card");
      card.innerHTML = `
          <h3>${new Date(appointment.date).toLocaleString()}</h3>
          <p><strong>${appointment.doctor.lastName} ${appointment.doctor.firstName}</strong></p>
          <p>${appointment.doctor.specialty.name}</p>
          <button class="cancel-btn" onclick="deleteAppointment(${appointment.id})">Отменить</button>
      `;
      appointmentsList.appendChild(card);
  });
}

// Функция удаления записи
async function deleteAppointment(id) {
  if (!confirm('Вы действительно хотите отменить запись?')) return;

  try {
      const response = await fetch(`/api/record/${id}`, {
          method: 'DELETE',
          credentials: 'include'
      });

      if (!response.ok) {
          throw new Error('Ошибка при удалении записи');
      }

      await fetchAppointments();
  } catch (error) {
      console.error(error);
      alert('Ошибка при удалении записи');
  }
}

// Кнопка записи на прием
document.getElementById("bookAppointmentBtn").addEventListener("click", () => {
  window.location.href = '/booking'
});

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
  fetchUserProfile();
});
