const specialtySelect = document.getElementById('specialtySelect');
const doctorSelect = document.getElementById('doctorSelect');
const timeSlotSelect = document.getElementById('timeSlotSelect');
const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');

// Функция загрузки специальностей
async function loadSpecialties() {
    try {
        const response = await fetch('/api/specialty');
        if (!response.ok) throw new Error('Ошибка загрузки специальностей');
        
        const specialties = await response.json();
        specialtySelect.innerHTML = '<option value="">Выберите специальность</option>';
        specialties.forEach(spec => {
            const option = document.createElement('option');
            option.value = spec.id;
            option.textContent = spec.name;
            specialtySelect.appendChild(option);
        });

        checkFormCompletion();
    } catch (error) {
        console.error(error);
        alert('Ошибка загрузки специальностей');
    }
}

// Функция загрузки врачей по специальности
async function loadDoctors(specialtyId) {
    try {
        const response = await fetch('/api/doctor');
        if (!response.ok) throw new Error('Ошибка загрузки врачей');

        const doctors = await response.json();
        doctorSelect.innerHTML = '<option value="">Выберите врача</option>';
        
        const filteredDoctors = doctors.filter(doc => doc.specialty.id == specialtyId);
        
        if (filteredDoctors.length === 0) {
            doctorSelect.innerHTML = '<option value="">Нет доступных врачей</option>';
            doctorSelect.disabled = true;
            return;
        }

        filteredDoctors.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${doc.lastName} ${doc.firstName} ${doc.middleName}`;
            doctorSelect.appendChild(option);
        });

        doctorSelect.disabled = false;
        checkFormCompletion();
    } catch (error) {
        console.error(error);
        alert('Ошибка загрузки врачей');
    }
}

// Функция загрузки доступных временных слотов
async function loadAvailableSlots(doctorId) {
    try {
        const response = await fetch(`/api/appointments?id=${doctorId}`);
        if (!response.ok) throw new Error('Ошибка загрузки записей');

        const appointments = await response.json();
        timeSlotSelect.innerHTML = '<option value="">Выберите время</option>';

        const availableTimes = generateTimeSlots();
        const bookedTimes = appointments.map(app => {
            const date = new Date(app.date);
            return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        });

        const freeTimes = availableTimes.filter(time => !bookedTimes.includes(time));

        if (freeTimes.length === 0) {
            timeSlotSelect.innerHTML = '<option value="">Нет доступного времени</option>';
            timeSlotSelect.disabled = true;
            return;
        }

        freeTimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSlotSelect.appendChild(option);
        });

        timeSlotSelect.disabled = false;
        checkFormCompletion();
    } catch (error) {
        console.error(error);
        alert('Ошибка загрузки временных слотов');
    }
}

// Генерация временных слотов с 09:00 до 18:00 с шагом 5 минут
function generateTimeSlots() {
    const slots = [];
    let startTime = new Date();
    startTime.setHours(9, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0);

    while (startTime < endTime) {
        const hours = startTime.getHours().toString().padStart(2, '0');
        const minutes = startTime.getMinutes().toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
        startTime.setMinutes(startTime.getMinutes() + 5);
    }

    return slots;
}

// Проверка заполненности формы
function checkFormCompletion() {
    const specialtySelected = specialtySelect.value;
    const doctorSelected = doctorSelect.value;
    const timeSelected = timeSlotSelect.value;

    bookAppointmentBtn.disabled = !(specialtySelected && doctorSelected && timeSelected);
}

// Обработчики событий
specialtySelect.addEventListener('change', () => {
    const selectedSpecialty = specialtySelect.value;
    if (selectedSpecialty) {
        loadDoctors(selectedSpecialty);
    } else {
        doctorSelect.innerHTML = '<option value="">Сначала выберите специальность</option>';
        doctorSelect.disabled = true;
    }
    checkFormCompletion();
});

doctorSelect.addEventListener('change', () => {
    const doctorId = doctorSelect.value;
    if (doctorId) {
        loadAvailableSlots(doctorId);
    } else {
        timeSlotSelect.innerHTML = '<option value="">Сначала выберите врача</option>';
        timeSlotSelect.disabled = true;
    }
    checkFormCompletion();
});

timeSlotSelect.addEventListener('change', checkFormCompletion);

bookAppointmentBtn.addEventListener('click', async () => {
    const doctorId = parseInt(doctorSelect.value, 10);  // Преобразуем в число
    const time = timeSlotSelect.value;

    if (!doctorId || isNaN(doctorId) || !time) {
        alert('Выберите врача и время для записи');
        return;
    }

    try {
        const today = new Date().toISOString().split('T')[0]; // Получение текущей даты
        const appointmentDate = new Date(`${today}T${time}:00`); // Форматируем дату для отправки

        const response = await fetch('/api/record', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                doctorId,  // Теперь doctorId - число
                date: appointmentDate.toISOString()  // Отправка даты в формате ISO
            })
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || 'Ошибка при записи');
        }

        alert('Вы успешно записаны!');
        loadAvailableSlots(doctorId);
    } catch (error) {
        console.error('Ошибка при записи:', error);
        alert('Ошибка при записи: ' + error.message);
    }
});


// Инициализация
loadSpecialties();
