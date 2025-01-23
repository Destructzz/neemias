// Пример данных пользователя и записей
const username = "Иван Иванов";
const appointments = [
  { time: "10:00", doctor: "Доктор Соколов", specialty: "Терапевт" },
  { time: "12:00", doctor: "Доктор Иванова", specialty: "Кардиолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
  { time: "15:00", doctor: "Доктор Кузнецов", specialty: "Офтальмолог" },
];

// Установка имени пользователя
document.getElementById("username").textContent = username;

// Отображение записей
const appointmentsList = document.getElementById("appointmentsList");
appointments.forEach((appointment) => {
  const card = document.createElement("div");
  card.classList.add("appointment-card");
  card.innerHTML = `
    <h3>${appointment.time}</h3>
    <p><strong>${appointment.doctor}</strong></p>
    <p>${appointment.specialty}</p>
  `;
  appointmentsList.appendChild(card);
});

// Кнопка записи
const bookAppointmentBtn = document.getElementById("bookAppointmentBtn");
bookAppointmentBtn.addEventListener("click", () => {
  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
});
