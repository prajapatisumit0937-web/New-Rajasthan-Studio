/* COUNTER */

/* ==========================
   PREMIUM SCROLL COUNTER
========================== */

const counters = document.querySelectorAll(".count");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            counters.forEach(counter => {

                if(counter.dataset.started) return;

                counter.dataset.started = "true";

                counter.innerText = "0";

                const target = +counter.dataset.target;

                const updateCounter = () => {

                    const current = +counter.innerText;

                    const increment = Math.ceil(target / 100);

                    if(current < target){

                        counter.innerText = Math.min(current + increment, target);

                        setTimeout(updateCounter, 20);

                    }else{

                        counter.innerText = target + "+";

                    }

                };

                updateCounter();

            });

        }

    });

},{threshold:0.5});

document.querySelectorAll(".counter").forEach(section=>{
    counterObserver.observe(section);
});


/*====================
LIGHTBOX
====================*/

const galleryImages=document.querySelectorAll(".gallery-box img");

const lightbox=document.getElementById("lightbox");

const lightboxImg=document.getElementById("lightbox-img");

const closeBtn=document.querySelector(".close");

galleryImages.forEach(img=>{

img.addEventListener("click",()=>{

lightbox.style.display="flex";

lightboxImg.src=img.src;

});

});

closeBtn.addEventListener("click",()=>{

lightbox.style.display="none";

});

lightbox.addEventListener("click",(e)=>{

if(e.target===lightbox){

lightbox.style.display="none";

}

});
/*====================
STICKY NAVBAR
====================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});
/*==========================
MOBILE MENU
==========================*/

const menuToggle=document.querySelector(".menu-toggle");

const nav=document.querySelector("nav");

menuToggle.addEventListener("click",()=>{

nav.classList.toggle("active");

});
/*=========================
LOADER
=========================*/

window.addEventListener("load",()=>{

setTimeout(()=>{

document.getElementById("loader").style.opacity="0";

setTimeout(()=>{

document.getElementById("loader").style.display="none";

},800);

},1800);

});
// BACK TO TOP

let topBtn=document.getElementById("topBtn");

window.onscroll=function(){

if(document.documentElement.scrollTop>400){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

}

topBtn.onclick=function(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}
// AOS Animation

AOS.init({

duration:1200,

once:true,

offset:100

});
            window.addEventListener("scroll",function(){

const header=document.querySelector("header");

header.classList.toggle("sticky",window.scrollY>50);

});






const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 120;

if(pageYOffset >= sectionTop){

current = section.getAttribute("id");

}

});

navLinks.forEach(link => {

link.classList.remove("active");

if(link.getAttribute("href") == "#" + current){

link.classList.add("active");

}

});

});

// Booking Date Minimum Today

const bookingDate = document.getElementById("bookingDate");

if (bookingDate) {
    const today = new Date().toISOString().split("T")[0];
    bookingDate.setAttribute("min", today);
}
/* TESTIMONIAL SLIDER */

const testimonials = document.querySelectorAll(".testimonial");

let currentTestimonial = 0;

function showTestimonial(){

testimonials.forEach(t => t.classList.remove("active"));

testimonials[currentTestimonial].classList.add("active");

currentTestimonial++;

if(currentTestimonial >= testimonials.length){

currentTestimonial = 0;

}

}

setInterval(showTestimonial,4000);
/* GALLERY FILTER */

const filterButtons = document.querySelectorAll(".gallery-menu button");
const galleryItems = document.querySelectorAll(".gallery-box");

filterButtons.forEach(button => {

button.addEventListener("click", () => {

filterButtons.forEach(btn => btn.classList.remove("active"));

button.classList.add("active");

const filter = button.dataset.filter;

galleryItems.forEach(item => {

if(filter === "all" || item.dataset.category === filter){

item.style.display = "block";

}else{

item.style.display = "none";

}

});

});

});
/* =========================
TOP PROGRESS BAR
========================= */

const progressBar = document.getElementById("progress-bar");

let progress = 0;

const loading = setInterval(() => {

progress += 5;

progressBar.style.width = progress + "%";

if(progress >= 100){

clearInterval(loading);

setTimeout(() => {

progressBar.style.opacity = "0";

},300);

}

},40);

/* =========================
   BOOKING POPUP + WHATSAPP
========================= */

const popup = document.getElementById("bookingPopup");
const openBtn = document.getElementById("bookNowBtn");
const closeBtnBooking = document.querySelector(".close-booking");
const bookingForm = document.getElementById("bookingForm");


/* OPEN BOOKING POPUP */

if (openBtn && popup) {

    openBtn.addEventListener("click", () => {

        popup.style.display = "flex";

    });

}


/* CLOSE BOOKING POPUP */

if (closeBtnBooking && popup) {

    closeBtnBooking.addEventListener("click", () => {

        popup.style.display = "none";

    });

}


/* CLOSE WHEN CLICKING OUTSIDE */

window.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.style.display = "none";

    }

});


/* BOOKING FORM */

if (bookingForm) {

  bookingForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const bookingService =
        document.getElementById("bookingService").value;

    const bookingDate =
        document.getElementById("bookingDate").value;

    const bookingTime =
        document.getElementById("bookingTime").value;


    /* CHECK FORM */

    if (
        !customerName ||
        !customerPhone ||
        !bookingService ||
        !bookingDate ||
        !bookingTime
    ) {

        alert("Please fill all booking details.");

        return;

    }


    /* BOOKING DATA */

    const bookingData = {

        customerName: customerName,

        customerPhone: customerPhone,

        bookingService: bookingService,

        bookingDate: bookingDate,

        bookingTime: bookingTime

    };


    try {

        /* SEND BOOKING TO BACKEND */

        const response = await fetch(
            "http://localhost:3000/api/bookings",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(bookingData)

            }
        );


        const result = await response.json();


        /* BACKEND ERROR */

        if (!response.ok) {

            alert(
                result.message ||
                "Booking failed."
            );

            return;

        }


        /* =========================
           WHATSAPP
        ========================= */

        const whatsappNumber = "919784064563";


        const message =
`*NEW BOOKING REQUEST*

Name: ${customerName}

Customer Phone: ${customerPhone}

Service: ${bookingService}

Date: ${bookingDate}

Time: ${bookingTime}

Booking Status: Pending

Please contact the customer for confirmation.`;


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);


        window.open(
            whatsappURL,
            "_blank"
        );


        /* RESET FORM */

        bookingForm.reset();


        /* CLOSE POPUP */

        if (popup) {

            popup.style.display = "none";

        }


        alert(
            "Booking request sent successfully!"
        );


    } catch (error) {

        console.error(
            "Booking Error:",
            error
        );

        alert(
            "Unable to connect to booking server."
        );

    }

});

}

/* =========================
   WHATSAPP BOOKING
========================= */



bookingForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const customerName =
        document.getElementById("customerName").value;

    const customerPhone =
        document.getElementById("customerPhone").value;

    const bookingService =
        document.getElementById("bookingService").value;

    const bookingDate =
        document.getElementById("bookingDate").value;

    const bookingTime =
        document.getElementById("bookingTime").value;


    /* YOUR WHATSAPP NUMBER */

    const whatsappNumber = "91XXXXXXXXXX";


    /* BOOKING MESSAGE */

    const message =
`*NEW BOOKING REQUEST*

Name: ${customerName}

Customer Phone: ${customerPhone}

Service: ${bookingService}

Date: ${bookingDate}

Time: ${bookingTime}

Please contact the customer for confirmation.`;


    /* OPEN WHATSAPP */

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);


    window.open(whatsappURL, "_blank");


    /* RESET FORM */

    bookingForm.reset();

});
/* =========================
   BACKEND API TEST
========================= */

fetch("http://localhost:3000/api/studio")

    .then(response => response.json())

    .then(data => {

        console.log("Backend Data:", data);

    })

    .catch(error => {

        console.error(
            "Backend Connection Error:",
            error
        );

    });
  async function loadStats() {

    const response =
        await fetch(
            "http://localhost:3000/api/bookings/stats"
        );

    const data =
        await response.json();

    document.getElementById("totalBookings")
        .textContent = data.stats.total;

    document.getElementById("pendingBookings")
        .textContent = data.stats.pending;

    document.getElementById("confirmedBookings")
        .textContent = data.stats.confirmed;

    document.getElementById("cancelledBookings")
        .textContent = data.stats.cancelled;
}