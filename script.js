const seats = document.querySelectorAll(".seat");
const selectedBox = document.getElementById("selectedSeats");
const count = document.getElementById("selectedCount");
const amount = document.getElementById("totalAmount");
const bookBtn = document.getElementById("confirmBooking");

const bookingsBox = document.getElementById("bookingHistory");
const bookingCount = document.getElementById("bookingCount");
const stats = document.querySelectorAll(".stat-card h4");

const price = {
    VIP: 500,
    PREMIUM: 300,
    REGULAR: 150
};

let booked = JSON.parse(localStorage.getItem("booked")) || [];

function seatInfo(seat) {
    let row = seat.parentElement.querySelector(".seats").textContent;
    let category = seat.parentElement.dataset.category;

    return {
        name: row + seat.textContent,
        category: category,
        price: price[category]
    };
}

let selected = [];

seats.forEach(seat => {
    let info = seatInfo(seat);

    if (booked.includes(info.name))
        seat.classList.add("booked");

    seat.onclick = () => {

        if (seat.classList.contains("booked"))
            return;

        if (seat.classList.contains("selected")) {
            seat.classList.remove("selected");
            selected = selected.filter(s => s.name !== info.name);
        }
        else {
            seat.classList.add("selected");
            selected.push(info);
        }
        update();
    };
});

function update() {
    selectedBox.innerHTML = "";

    let total = 0;

    selected.forEach(s => {
        total += s.price;
        selectedBox.innerHTML +=`<p>${s.name} - ${s.category} ₹${s.price}</p>`;
    });

    if (selected.length == 0)
        selectedBox.innerHTML = `<p class="empty">No seats selected</p>`;

    count.textContent = `${selected.length} Seats`;
    amount.textContent = `₹${total}`;
    bookBtn.disabled = selected.length == 0;

    stats[1].textContent = booked.length;
    stats[2].textContent = 60 - booked.length;
}

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

bookBtn.onclick = () => {

    let total = selected.reduce((sum, s) => sum + s.price, 0);

    bookings.push({
        id: Date.now(),
        seats: selected,
        total: total,
        date: new Date().toLocaleString()
    });

    selected.forEach(s => {
        booked.push(s.name);
    });

    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.setItem("booked", JSON.stringify(booked));

    selected.forEach(s => {
        document.querySelectorAll(".seat").forEach(seat => {
            if (seatInfo(seat).name == s.name) {
                seat.classList.remove("selected");
                seat.classList.add("booked");
            }
        });
    });
    selected = [];
    update();
    showBookings();
};

function showBookings() {
    bookingsBox.innerHTML = "";

    bookingCount.textContent =`${bookings.length} Booking`;

    if (bookings.length == 0) {
        bookingsBox.innerHTML = `<p class="empty">No previous bookings.</p>`;
        return;
    }

    bookings.forEach(b => {
        bookingsBox.innerHTML += `
            <div class="booking-item">
                <div>
                    <strong>Seats: ${b.seats.map(s => s.name).join(", ")}</strong>
                    <p>Total: ₹${b.total}</p>
                    <small>${b.date}</small>
                </div>

                <button onclick="cancelBooking(${b.id})">
                    Cancel
                </button>
            </div>
        `;
    });
}

function cancelBooking(id) {
    let booking = bookings.find(b => b.id == id);
    booking.seats.forEach(s => {
        booked = booked.filter(seat => seat != s.name);

        document.querySelectorAll(".seat").forEach(seat => {
            if (seatInfo(seat).name == s.name)
                seat.classList.remove("booked");
        });
    });
    bookings = bookings.filter(b => b.id != id);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.setItem("booked", JSON.stringify(booked));

    update();
    showBookings();
}

update();
showBookings();