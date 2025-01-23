const doctorList = document.getElementById('doctorList');
const addDoctorBtn = document.getElementById('addDoctorBtn');
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const addDoctorForm = document.getElementById('addDoctorForm');

let doctors = [
  { id: 1, fullname: 'Иван Иванов', specialty: 'Терапевт' },
  { id: 2, fullname: 'Анна Петрова', specialty: 'Кардиолог' },
  { id: 3, fullname: 'Сергей Смирнов', specialty: 'Хирург' },
  { id: 4, fullname: 'Мария Кузнецова', specialty: 'Офтальмолог' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 6, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 5, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 9, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 8, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 7, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
  { id: 6, fullname: 'Дмитрий Соколов', specialty: 'Педиатр' },
];

// Рендеринг списка врачей
function renderDoctors() {
  doctorList.innerHTML = '';
  doctors.forEach((doctor) => {
    const card = document.createElement('div');
    card.classList.add('doctor-card');
    card.innerHTML = `
      <h3>${doctor.fullname}</h3>
      <p>${doctor.specialty}</p>
      <button class="delete-btn" onclick="deleteDoctor(${doctor.id})">❌</button>
    `;
    doctorList.appendChild(card);
  });
}

// Удаление врача
function deleteDoctor(id) {
  doctors = doctors.filter((doctor) => doctor.id !== id);
  renderDoctors();
}

// Открытие модального окна
addDoctorBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// Закрытие модального окна
cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Добавление нового врача
addDoctorForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fullname = document.getElementById('fullname').value;
  const specialty = document.getElementById('specialty').value;

  const newDoctor = {
    id: Date.now(),
    fullname,
    specialty,
  };

  doctors.push(newDoctor);
  renderDoctors();
  modal.classList.add('hidden');
  addDoctorForm.reset();
});

// Изначальный рендеринг
renderDoctors();
