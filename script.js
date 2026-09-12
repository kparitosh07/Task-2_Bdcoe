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
    };
});

