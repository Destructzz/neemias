// Элементы DOM
const doctorList = document.getElementById('doctorList');
const addDoctorBtn = document.getElementById('addDoctorBtn');
const modalDoctor = document.getElementById('modalDoctor');
const cancelDoctorBtn = document.getElementById('cancelDoctorBtn');
const addDoctorForm = document.getElementById('addDoctorForm');
const specialtySelect = document.getElementById('specialtySelect');

const specialtyList = document.getElementById('specialtyList');
const addSpecialtyBtn = document.getElementById('addSpecialtyBtn');
const modalSpecialty = document.getElementById('modalSpecialty');
const cancelSpecialtyBtn = document.getElementById('cancelSpecialtyBtn');
const addSpecialtyForm = document.getElementById('addSpecialtyForm');

// ===================================================
// Загрузка списка врачей
async function loadDoctors() {
  try {
    const response = await fetch('/api/doctor');
    if (!response.ok) throw new Error('Не удалось получить список врачей');

    const doctors = await response.json();
    console.log(doctors)
    renderDoctors(doctors);
  } catch (error) {
    console.error(error);
    alert('Ошибка при загрузке списка врачей');
  }
}

function renderDoctors(doctors) {
  doctorList.innerHTML = '';
  doctors.forEach((doctor) => {
    const card = document.createElement('div');
    card.classList.add('doctor-card');
    card.innerHTML = `
      <h3>${doctor.lastName} ${doctor.firstName} ${doctor.middleName}</h3>
      <p>${doctor.specialty.name}</p>
      <button class="delete-btn">❌</button>
    `;
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteDoctor(doctor.id));
    doctorList.appendChild(card);
  });
}

// Удаление врача
async function deleteDoctor(id) {
  if (!confirm('Вы действительно хотите удалить этого врача?')) return;

  try {
    const response = await fetch(`/api/doctor/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Ошибка при удалении врача');

    await loadDoctors();
  } catch (error) {
    console.error(error);
    alert('Ошибка при удалении врача');
  }
}

// ===================================================
// Загрузка и отображение специальностей
async function loadSpecialties() {
  try {
    const response = await fetch('/api/specialty');
    if (!response.ok) throw new Error('Не удалось получить список специальностей');

    const specialties = await response.json();
    console.log(specialties)
    renderSpecialties(specialties);
    populateSpecialtySelect(specialties);
  } catch (error) {
    console.error(error);
    alert('Ошибка при загрузке специальностей');
  }
}

function renderSpecialties(specialties) {
  specialtyList.innerHTML = '';
  specialties.forEach((specialty) => {
    const card = document.createElement('div');
    card.classList.add('specialty-card');
    card.innerHTML = `
      <h3>${specialty.name}</h3>
      <button class="delete-btn">❌</button>
    `;
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteSpecialty(specialty.id));
    specialtyList.appendChild(card);
  });
}

function populateSpecialtySelect(specialties) {
  specialtySelect.innerHTML = '<option value="">Выберите специальность</option>';
  specialties.forEach((specialty) => {
    const option = document.createElement('option');
    option.value = specialty.name;
    option.textContent = specialty.name;
    specialtySelect.appendChild(option);
  });
}

// Удаление специальности
async function deleteSpecialty(id) {
  if (!confirm('Вы действительно хотите удалить эту специальность?')) return;

  try {
    const response = await fetch(`/api/specialty/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Ошибка при удалении специальности');

    await loadSpecialties();
  } catch (error) {
    console.error(error);
    alert('Ошибка при удалении специальности');
  }
}

// ===================================================
// Добавление врача
addDoctorBtn.addEventListener('click', () => modalDoctor.classList.remove('hidden'));
cancelDoctorBtn.addEventListener('click', () => modalDoctor.classList.add('hidden'));

addDoctorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const lastName = document.getElementById('lastName').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const middleName = document.getElementById('middleName').value.trim();
  const specialty = specialtySelect.value;

  if (!lastName || !firstName || !middleName || !specialty) {
    alert('Пожалуйста, заполните все поля!');
    return;
  }

  try {
    const response = await fetch('/api/doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastName, firstName, middleName, specialty }),
    });
    if (!response.ok) throw new Error('Ошибка при добавлении врача');

    modalDoctor.classList.add('hidden');
    addDoctorForm.reset();
    await loadDoctors();
  } catch (error) {
    console.error(error);
    alert('Ошибка при добавлении врача');
  }
});

// ===================================================
// Добавление специальности
addSpecialtyBtn.addEventListener('click', () => modalSpecialty.classList.remove('hidden'));
cancelSpecialtyBtn.addEventListener('click', () => modalSpecialty.classList.add('hidden'));

addSpecialtyForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const specialtyName = document.getElementById('specialtyName').value.trim();

  if (!specialtyName) {
    alert('Пожалуйста, введите название специальности!');
    return;
  }

  try {
    const response = await fetch('/api/specialty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: specialtyName }),
    });
    if (!response.ok) throw new Error('Ошибка при добавлении специальности');

    modalSpecialty.classList.add('hidden');
    addSpecialtyForm.reset();
    await loadSpecialties();
  } catch (error) {
    console.error(error);
    alert('Ошибка при добавлении специальности');
  }
});

// ===================================================
// Инициализация
(async function init() {
  await loadDoctors();
  await loadSpecialties();
})();
