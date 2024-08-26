document.addEventListener('DOMContentLoaded', () => {
    const doctors = [
        { id: 1, name: 'Dr. John Doe', totalSlots: 20 },
        { id: 2, name: 'Dr. William', totalSlots: 20 },
        { id: 3, name: 'Dr. Meena', totalSlots: 20 }
    ];

    const appointments = [
        { id: 'APP-1', patientName: 'Alice', doctorId: 1, date: '2024-08-26', time: '09:00' },
        { id: 'APP-2', patientName: 'Bob', doctorId: 2, date: '2024-08-27', time: '15:00' }
    ];

    function populateDoctors() {
        const doctorSelect = document.getElementById('doctor');
        const doctorCards = document.querySelector('.doctor-card');

        doctorSelect.innerHTML = '';
        doctorCards.innerHTML = '';

        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);

            const card = document.createElement('div');
            card.classList.add('doctor-card');
            card.setAttribute('data-doctor-id', doctor.id);
            card.innerHTML = `
                <h3>${doctor.name}</h3>
                <p>Total Time Slots: <span class="total-slots">${doctor.totalSlots}</span></p>
                <p>Available Slots: <span class="available-slots">${calculateAvailableSlots(doctor.id)}</span></p>
                <p>Booked Slots: <span class="booked-slots">${calculateBookedSlots(doctor.id)}</span></p>
                <div class="time-slots">
                    ${generateTimeSlots(doctor.id).map(slot => `<div class="slot ${slot.status}" data-time="${slot.time}">${slot.time}</div>`).join('')}
                </div>
            `;
            doctorCards.appendChild(card);
        });
    }

    function generateTimeSlots(doctorId) {
        const timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
            '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
        ];

        const bookedSlots = appointments.filter(app => app.doctorId === doctorId).map(app => app.time);

        return timeSlots.map(time => ({
            time,
            status: bookedSlots.includes(time) ? 'booked' : 'available'
        }));
    }

    function calculateAvailableSlots(doctorId) {
        return generateTimeSlots(doctorId).filter(slot => slot.status === 'available').length;
    }

    function calculateBookedSlots(doctorId) {
        return generateTimeSlots(doctorId).filter(slot => slot.status === 'booked').length;
    }

    function updateSlotStatus(doctorId, time, status) {
        const slots = document.querySelectorAll(`.doctor-card[data-doctor-id="${doctorId}"] .slot[data-time="${time}"]`);
        slots.forEach(slot => {
            slot.classList.remove('available', 'booked');
            slot.classList.add(status);
        });
        console.log(`Slot updated to ${status} for doctorId ${doctorId} at time ${time}`);
    

        // Update available and booked slot counts
        document.querySelector(`.doctor-card[data-doctor-id="${doctorId}"] .available-slots`).textContent = calculateAvailableSlots(doctorId);
        document.querySelector(`.doctor-card[data-doctor-id="${doctorId}"] .booked-slots`).textContent = calculateBookedSlots(doctorId);
    }

    document.getElementById('booking-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const patientName = document.getElementById('patient-name').value;
        const doctorId = parseInt(document.getElementById('doctor').value);
        const date = document.getElementById('date').value;

        function formatTime(timeString) {
            // Assumes timeString is in 'HH:MM' format
            const [hours, minutes] = timeString.split(':');
            return `${hours}:${minutes}`;
        }
        const time = document.getElementById('time').value;



        if (!patientName || !doctorId || !date || !time) {
            alert('Please fill out all fields.');
            return;
        }

        if (appointments.some(app => app.doctorId === doctorId && app.date === date && app.time === time)) {
            alert('This time slot is already booked.');
            return;
        }

        const appointmentId = `APP-${appointments.length + 1}`;
        appointments.push({ id: appointmentId, patientName, doctorId, date, time });
        alert(`Appointment booked successfully with ID: ${appointmentId}`);

        // Update slot status to booked
        updateSlotStatus(doctorId, time, 'booked');

        document.getElementById('booking-form').reset();
    });

    document.getElementById('cancellation-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const appointmentId = document.getElementById('appointment-id').value;

        if (!appointmentId) {
            alert('Please enter an appointment ID.');
            return;
        }

        const index = appointments.findIndex(app => app.id === appointmentId);
        if (index !== -1) {
            const { doctorId, time } = appointments[index];
            appointments.splice(index, 1);

            // Update slot status to available
            updateSlotStatus(doctorId, time, 'available');

            alert('Appointment cancelled successfully.');


            document.getElementById('cancellation-form').reset();
        } else {
            alert('Invalid Appointment ID.');
        }
    });

    document.getElementById('view-appointments-btn').addEventListener('click', function() {
        const appointmentsList = document.getElementById('appointments-list');
        appointmentsList.innerHTML = '';

        appointments.forEach(app => {
            const item = document.createElement('div');
            item.innerHTML = `
                <strong>ID:</strong> ${app.id} <br>
                <strong>Patient:</strong> ${app.patientName} <br>
                <strong>Doctor:</strong> ${doctors.find(doc => doc.id === app.doctorId).name} <br>
                <strong>Date:</strong> ${app.date} <br>
                <strong>Time:</strong> ${app.time}
            `;
            appointmentsList.appendChild(item);
        });
    });

    
    

    populateDoctors();
});
