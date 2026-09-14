const events = [
    {id:"akgec",title:"AKGEC Fest 2026",type:"FESTIVAL",date:"20 June 2026",shortDate:"20 JUN",venue:"Vedanta Farm, Ghaziabad",description:"A high-energy celebration packed with live performances, food, games and unforgettable campus vibes.",prices:{VIP:500,PREMIUM:300,REGULAR:150}},
    {id:"neon",title:"Neon Nights",type:"MUSIC",date:"28 June 2026",shortDate:"28 JUN",venue:"Noida Stadium, Noida",description:"A night full of electronic music, lights and amazing performances.",prices:{VIP:600,PREMIUM:400,REGULAR:200}},
    {id:"comedy",title:"Comedy Night",type:"COMEDY",date:"5 July 2026",shortDate:"05 JUL",venue:"India Expo Centre, Greater Noida",description:"Enjoy an evening full of jokes, laughter and some of the best comedians.",prices:{VIP:450,PREMIUM:300,REGULAR:180}},
    {id:"food",title:"Food & Fun Fest",type:"FOOD FEST",date:"12 July 2026",shortDate:"12 JUL",venue:"City Park, Noida",description:"Taste delicious food, enjoy games and spend a fun-filled day with friends.",prices:{VIP:350,PREMIUM:250,REGULAR:150}},
    {id:"tech",title:"Tech Innovation Expo",type:"TECH",date:"20 July 2026",shortDate:"20 JUL",venue:"Expo Mart, Greater Noida",description:"Explore new technology, innovative ideas and exciting student projects.",prices:{VIP:500,PREMIUM:350,REGULAR:200}},
    {id:"battle",title:"Battle of Bands",type:"MUSIC",date:"27 July 2026",shortDate:"27 JUL",venue:"Open Air Theatre, Ghaziabad",description:"Watch talented bands compete for the ultimate music championship.",prices:{VIP:550,PREMIUM:350,REGULAR:200}}
];

const eventGrid=document.getElementById("eventGrid");
const eventModal=document.getElementById("eventModal");
const modalContent=document.getElementById("modalContent");
let currentEvent=null;
let selectedSeats=[];

function showEvents(){
    eventGrid.innerHTML=events.slice(1).map((event,i)=>`
        <article class="event-card">
            <div class="event-cover cover-${i+2}">
                <span class="date-badge">${event.shortDate}</span>
            </div>
            <div class="event-body">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="card-bottom">
                    <div class="from">FROM<strong>₹${event.prices.REGULAR}</strong></div>
                    <button class="book-small" onclick="openEvent('${event.id}')">Book Now</button>
                </div>
            </div>
        </article>
    `).join("");
}

function openEvent(eventId){
    currentEvent=events.find(event=>event.id==eventId);
    if(!currentEvent)return;
    selectedSeats=[];
    modalContent.innerHTML=`
        <div class="modal-head">
            <span class="eyebrow">${currentEvent.type}</span>
            <h2>${currentEvent.title}</h2>
            <p>📅 ${currentEvent.date} • 📍 ${currentEvent.venue}</p>
        </div>
        <div class="seat-legend">
            <div class="legend-item"><span class="dot vip"></span>VIP ₹${currentEvent.prices.VIP}</div>
            <div class="legend-item"><span class="dot premium"></span>Premium ₹${currentEvent.prices.PREMIUM}</div>
            <div class="legend-item"><span class="dot normal"></span>Regular ₹${currentEvent.prices.REGULAR}</div>
            <div class="legend-item"><span class="dot selected"></span>Selected</div>
            <div class="legend-item"><span class="dot booked"></span>Booked</div>
        </div>
        <div id="seatArea"></div>
        <div class="booking-footer">
            <div>
                <small id="selectedCount">0 Seats</small>
                <strong id="totalAmount">₹0</strong>
            </div>
            <button id="confirmBooking" class="confirm-btn" disabled>Book Tickets</button>
        </div>
    `;
    createSeats();
    eventModal.classList.remove("hidden");
    updateBooking();
}

function createSeats(){
    const seatArea=document.getElementById("seatArea");
    const categories=[
        {name:"VIP",row:"A",price:currentEvent.prices.VIP},
        {name:"PREMIUM",row:"B",price:currentEvent.prices.PREMIUM},
        {name:"REGULAR",row:"C",price:currentEvent.prices.REGULAR}
    ];
    seatArea.innerHTML=categories.map(category=>`
        <div class="seat-section">
            <div class="seat-section-title">
                <span>${category.name}</span>
                <strong>₹${category.price}</strong>
            </div>
            <div class="seat-grid" data-category="${category.name}">
                <span class="seats" style="display:none">${category.row}</span>
                ${Array.from({length:20},(_,i)=>`
                    <button class="seat ${category.name=="VIP"?"vip":category.name=="PREMIUM"?"premium":""}">
                        ${i+1}
                    </button>
                `).join("")}
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".seat").forEach(seat=>{
        seat.onclick=()=>selectSeat(seat);
    });

    loadBookedSeats();
}

function getSeatInfo(seat){
    const grid=seat.parentElement;
    const category=grid.dataset.category;
    return {
        name:grid.querySelector(".seats").textContent+seat.textContent.trim(),
        category:category,
        price:currentEvent.prices[category]
    };
}

function getBookedSeats(){
    const bookings=JSON.parse(localStorage.getItem("bookings"))||[];

    return bookings
        .filter(booking=>booking.eventId==currentEvent.id && booking.status!="Cancelled")
        .flatMap(booking=>booking.seats.map(seat=>seat.name));
}

function loadBookedSeats(){
    const booked=getBookedSeats();
    document.querySelectorAll(".seat").forEach(seat=>{
        if(booked.includes(getSeatInfo(seat).name))
            seat.classList.add("booked");
    });
}

function selectSeat(seat){
    if(seat.classList.contains("booked"))return;
    const info=getSeatInfo(seat);

    if(seat.classList.contains("selected")){
        seat.classList.remove("selected");
        selectedSeats=selectedSeats.filter(s=>s.name!=info.name);
    }else{
        seat.classList.add("selected");
        selectedSeats.push(info);
    }
    updateBooking();
}

function updateBooking(){
    const count=document.getElementById("selectedCount");
    const amount=document.getElementById("totalAmount");
    const button=document.getElementById("confirmBooking");
    if(!count||!amount||!button)return;

    const total=selectedSeats.reduce((sum,seat)=>sum+seat.price,0);
    count.textContent=`${selectedSeats.length} Seats`;
    amount.textContent=`₹${total}`;
    button.disabled=selectedSeats.length==0;
}

function confirmBooking(){
    if(!selectedSeats.length)return;

    const bookings=JSON.parse(localStorage.getItem("bookings"))||[];
    const total=selectedSeats.reduce((sum,seat)=>sum+seat.price,0);

    bookings.push({
        id:Date.now(),
        eventId:currentEvent.id,
        eventName:currentEvent.title,
        venue:currentEvent.venue,
        seats:selectedSeats,
        total:total,
        date:new Date().toLocaleString()
    });

    localStorage.setItem("bookings",JSON.stringify(bookings));
    showBookingHistory();
    showToast("Tickets booked successfully!");
    closeEvent();
}

function closeEvent(){
    eventModal.classList.add("hidden");
    selectedSeats=[];
    currentEvent=null;
}

function showBookingHistory(){
    const box=document.getElementById("bookingHistory");
    const count=document.getElementById("navBookingCount");
    const bookings=JSON.parse(localStorage.getItem("bookings"))||[];

    count.textContent=bookings.length;

    if(!bookings.length){
        box.innerHTML=`<div class="empty-history">No previous bookings.</div>`;
        return;
    }

    box.innerHTML=bookings.slice().reverse().map(booking=>`
        <div class="history-item">
            <div class="history-main">
                <strong>${booking.eventName}</strong>
                <span>📍 ${booking.venue}</span>
                <span>📅 ${booking.date}</span>
            </div>
            <div class="history-seats">
                Seats: ${booking.seats.map(seat=>seat.name).join(", ")}
            </div>
            <div>
                <div class="history-total">
                    ₹${booking.total}
                </div>
                ${
                    booking.status=="Cancelled"
                    ? `<span>Cancelled</span>`
                    : `<button class="cancel-btn" onclick="cancelBooking(${booking.id})">Cancel</button>`
                }
            </div>
        </div>
    `).join("");
}

function cancelBooking(id){
    let bookings=JSON.parse(localStorage.getItem("bookings"))||[];
    let booking=bookings.find(b=>b.id==id);

    if(!booking)return;

    booking.status="Cancelled";
    localStorage.setItem("bookings",JSON.stringify(bookings));
    showBookingHistory();
    showToast("Booking cancelled successfully!");
}

function clearHistory(){
    const bookings=JSON.parse(localStorage.getItem("bookings"))||[];
    if(!bookings.length)return;

    if(confirm("Are you sure you want to clear booking history?")){
        localStorage.removeItem("bookings");
        showBookingHistory();
        showToast("Booking history cleared!");
    }
}

function showToast(message){
    const toast=document.getElementById("toast");
    toast.textContent=message;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),2500);
}

const atomCanvas=document.getElementById("atomCanvas");
const atomContext=atomCanvas.getContext("2d");
let atoms=[];

function resizeCanvas(){
    atomCanvas.width=innerWidth;
    atomCanvas.height=innerHeight;
}

function createAtoms(){
    atoms=Array.from({length:70},()=>({
        x:Math.random()*atomCanvas.width,
        y:Math.random()*atomCanvas.height,
        size:Math.random()*2+1,
        speedX:(Math.random()-.5)*.5,
        speedY:(Math.random()-.5)*.5
    }));
}

function animateAtoms(){
    atomContext.clearRect(0,0,atomCanvas.width,atomCanvas.height);

    atoms.forEach(atom=>{
        atom.x+=atom.speedX;
        atom.y+=atom.speedY;

        if(atom.x<0||atom.x>atomCanvas.width)atom.speedX*=-1;
        if(atom.y<0||atom.y>atomCanvas.height)atom.speedY*=-1;

        atomContext.beginPath();
        atomContext.arc(atom.x,atom.y,atom.size,0,Math.PI*2);
        atomContext.fillStyle="rgba(139,124,255,.8)";
        atomContext.fill();
    });

    atoms.forEach((a,i)=>{
        atoms.slice(i+1).forEach(b=>{
            const distance=Math.hypot(a.x-b.x,a.y-b.y);

            if(distance<130){
                atomContext.beginPath();
                atomContext.moveTo(a.x,a.y);
                atomContext.lineTo(b.x,b.y);
                atomContext.strokeStyle="rgba(139,124,255,.12)";
                atomContext.stroke();
            }
        });
    });
    requestAnimationFrame(animateAtoms);
}

window.addEventListener("resize",()=>{
    resizeCanvas();
    createAtoms();
});

resizeCanvas();
createAtoms();
animateAtoms();
showEvents();
showBookingHistory();

window.openEvent=openEvent;
window.closeEvent=closeEvent;
window.cancelBooking=cancelBooking;
window.clearHistory=clearHistory;

document.addEventListener("click",event=>{
    if(event.target.id=="confirmBooking")confirmBooking();
});