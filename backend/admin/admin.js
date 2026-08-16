let allBookings = [];
/* =========================
   ADMIN LOGIN CHECK
========================= */

if (
    localStorage.getItem(
        "adminLoggedIn"
    ) !== "true"
) {

    window.location.href =
        "login.html";

}
const API_URL =
    "http://localhost:3000";


/* =========================
   LOAD STATISTICS
========================= */

async function loadStats() {

    try {

        const response =
            await fetch(
                API_URL +
                "/api/bookings/stats"
            );


        const data =
            await response.json();


        document.getElementById(
            "totalBookings"
        ).innerText =
            data.stats.total;


        document.getElementById(
            "pendingBookings"
        ).innerText =
            data.stats.pending;


        document.getElementById(
            "confirmedBookings"
        ).innerText =
            data.stats.confirmed;


        document.getElementById(
            "cancelledBookings"
        ).innerText =
            data.stats.cancelled;


    } catch (error) {

        console.error(
            "Stats Error:",
            error
        );

    }

}


/* =========================
   LOAD BOOKINGS
========================= */

async function loadBookings() {

    try {

        const response =
            await fetch(
                API_URL +
                "/api/bookings"
            );


        const data =
            await response.json();
allBookings = data.bookings;

        displayBookings(
            data.bookings
        );


        loadStats();


    } catch (error) {

        console.error(
            "Booking Error:",
            error
        );

    }

}


/* =========================
   DISPLAY BOOKINGS
========================= */

function displayBookings(bookings) {

    const recentContainer =
        document.getElementById(
            "recentBookings"
        );


    const allContainer =
        document.getElementById(
            "allBookings"
        );


    if (!bookings.length) {

        recentContainer.innerHTML =
            `<p class="empty">
                No bookings available.
            </p>`;


        allContainer.innerHTML =
            `<p class="empty">
                No bookings available.
            </p>`;

        return;

    }


    /* NEWEST FIRST */

    bookings.sort(
        (a, b) =>
            b.id - a.id
    );


    /* RECENT 5 */

    const recent =
        bookings.slice(
            0,
            5
        );


    recentContainer.innerHTML =
        recent
        .map(createBookingCard)
        .join("");


    allContainer.innerHTML =
        bookings
        .map(createBookingCard)
        .join("");

}


/* =========================
   BOOKING CARD
========================= */

function createBookingCard(booking) {

    const statusClass =
        booking.status
            .toLowerCase();


    return `

        <div class="booking-card">

            <div class="booking-top">

                <div class="booking-name">

                    ${escapeHTML(
                        booking.customerName
                    )}

                </div>


                <span
                    class="status ${statusClass}"
                >

                    ${booking.status}

                </span>

            </div>


            <div class="booking-info">

                <div>
                    📞
                    ${escapeHTML(
                        booking.customerPhone
                    )}
                </div>


                <div>
                    📷
                    ${escapeHTML(
                        booking.service
                    )}
                </div>


                <div>
                    📅
                    ${booking.date}
                </div>


                <div>
                    ⏰
                    ${booking.time}
                </div>

            </div>


            <div class="actions">

                <button
                    onclick="
                    updateStatus(
                        ${booking.id},
                        'Confirmed'
                    )
                    "
                >
                    ✓ Confirm
                </button>


                <button
                    onclick="
                    updateStatus(
                        ${booking.id},
                        'Cancelled'
                    )
                    "
                >
                    × Cancel
                </button>


                <button
                    onclick="
                    deleteBooking(
                        ${booking.id}
                    )
                    "
                >
                    🗑 Delete
                </button>

            </div>

        </div>

    `;

}


/* =========================
   UPDATE STATUS
========================= */

async function updateStatus(
    id,
    status
) {

    try {

        const response =
            await fetch(

                API_URL +
                `/api/bookings/${id}/status`,

                {

                    method:
                        "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            status:
                                status
                        })

                }

            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message
            );

            return;

        }


        loadBookings();


    } catch (error) {

        console.error(
            "Update Error:",
            error
        );

        alert(
            "Unable to update booking."
        );

    }

}


/* =========================
   DELETE BOOKING
========================= */

async function deleteBooking(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this booking?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(

                API_URL +
                `/api/bookings/${id}`,

                {

                    method:
                        "DELETE"

                }

            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message
            );

            return;

        }


        loadBookings();


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Unable to delete booking."
        );

    }

}


/* =========================
   NAVIGATION
========================= */

function showDashboard() {

    document.getElementById(
        "dashboardSection"
    ).style.display =
        "block";


    document.getElementById(
        "bookingsSection"
    ).style.display =
        "none";

}


function showBookings() {

    document.getElementById(
        "dashboardSection"
    ).style.display =
        "none";


    document.getElementById(
        "bookingsSection"
    ).style.display =
        "block";


    loadBookings();

}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================
   START
========================= */

loadBookings();
function logoutAdmin() {

    localStorage.removeItem(
        "adminLoggedIn"
    );

    window.location.href =
        "login.html";

}
/* =========================
   BOOKING FILTER
========================= */

function filterBookings() {

    const search =
        document
            .getElementById(
                "searchBooking"
            )
            .value
            .toLowerCase();


    const status =
        document
            .getElementById(
                "statusFilter"
            )
            .value;


    const service =
        document
            .getElementById(
                "serviceFilter"
            )
            .value;


    const filtered =
        allBookings.filter(
            booking => {


                const matchesSearch =

                    booking.customerName
                        .toLowerCase()
                        .includes(search)

                    ||

                    booking.customerPhone
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =

                    status === "all"

                    ||

                    booking.status ===
                    status;


                const matchesService =

                    service === "all"

                    ||

                    booking.service ===
                    service;


                return (

                    matchesSearch &&

                    matchesStatus &&

                    matchesService

                );

            }
        );


    displayBookings(
        filtered
    );

}
document
    .getElementById(
        "searchBooking"
    )
    .addEventListener(
        "input",
        filterBookings
    );


document
    .getElementById(
        "statusFilter"
    )
    .addEventListener(
        "change",
        filterBookings
    );


document
    .getElementById(
        "serviceFilter"
    )
    .addEventListener(
        "change",
        filterBookings
    );
    function displayBookings(bookings) {

    const container =
        document.getElementById(
            "bookingsContainer"
        );

    container.innerHTML = "";

    if (bookings.length === 0) {

        container.innerHTML = `
            <div class="no-bookings">
                No bookings found.
            </div>
        `;

        return;
    }

    bookings.forEach(booking => {

        const card =
            document.createElement("div");

        card.className =
            "booking-card";

        card.innerHTML = `

            <div class="booking-info">

                <h3>
                    ${booking.customerName}
                </h3>

                <p>
                    📞 ${booking.customerPhone}
                </p>

                <p>
                    📷 ${booking.service}
                </p>

                <p>
                    📅 ${booking.date}
                </p>

                <p>
                    ⏰ ${booking.time}
                </p>

                <strong>
                    ${booking.status}
                </strong>

            </div>

            <div class="booking-actions">

                <button
                    onclick="updateStatus(
                        ${booking.id},
                        'Confirmed'
                    )">
                    Confirm
                </button>

                <button
                    onclick="updateStatus(
                        ${booking.id},
                        'Cancelled'
                    )">
                    Cancel
                </button>

                <button
                    onclick="deleteBooking(
                        ${booking.id}
                    )">
                    Delete
                </button>

            </div>
        `;

        container.appendChild(card);

    });
}
async function updateStatus(id, status) {

    const response =
        await fetch(
            `http://localhost:3000/api/bookings/${id}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

    const data =
        await response.json();

    if (data.success) {

        alert(
            `Booking ${status}`
        );

        loadBookings();
        loadStats();

    }

}
async function deleteBooking(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this booking?"
        );

    if (!confirmDelete) return;

    const response =
        await fetch(
            `http://localhost:3000/api/bookings/${id}`,
            {
                method: "DELETE"
            }
        );

    const data =
        await response.json();

    if (data.success) {

        alert(
            "Booking deleted successfully."
        );

        loadBookings();
        loadStats();

    }

}