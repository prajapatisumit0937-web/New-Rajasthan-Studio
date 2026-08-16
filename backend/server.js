require("dotenv").config();
const PORT =
    process.env.PORT || 3000;
    const whatsappNumber =
    process.env.WHATSAPP_NUMBER;
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const app = express();


/* =========================
   WHATSAPP MESSAGE
========================= */

function createWhatsAppMessage(
    booking
) {

    return `NEW BOOKING REQUEST

Name: ${booking.customerName}

Phone: ${booking.customerPhone}

Service: ${booking.service}

Date: ${booking.date}

Time: ${booking.time}

Status: ${booking.status}

New Rajasthan Studio
Sewari, Rajasthan`;

}
/* =========================
   DATABASE
========================= */

const db = new Database("studio.db");


db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        customerName TEXT NOT NULL,

        customerPhone TEXT NOT NULL,

        service TEXT NOT NULL,

        date TEXT NOT NULL,

        time TEXT NOT NULL,

        status TEXT NOT NULL DEFAULT 'Pending',

        createdAt TEXT NOT NULL

    )
`);


/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(cors());


app.use(express.static(path.join(__dirname, "public")));
/* =========================
   BOOKING FILE
========================= */

const bookingsFile =
    path.join(__dirname, "bookings.json");

app.post(
    "/api/bookings",
    bookingLimiter,
    (req, res) => {

        // booking code

    }
);
/* =========================
   READ BOOKINGS
========================= */

function readBookings() {

    try {

        if (!fs.existsSync(bookingsFile)) {

            fs.writeFileSync(
                bookingsFile,
                "[]"
            );

            return [];

        }

        const data =
            fs.readFileSync(
                bookingsFile,
                "utf8"
            );

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Error reading bookings:",
            error
        );

        return [];

    }

}


/* =========================
   SAVE BOOKINGS
========================= */

function saveBookings(bookings) {

    try {

        fs.writeFileSync(

            bookingsFile,

            JSON.stringify(
                bookings,
                null,
                2
            )

        );

        return true;

    } catch (error) {

        console.error(
            "Error saving bookings:",
            error
        );

        return false;

    }

}


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {

    res.send(
        "New Rajasthan Studio Backend is Working!"
    );

});

/* =========================
   ADMIN LOGIN API
========================= */

app.post(
    "/api/admin/login",
    (req, res) => {


        const {
            username,
            password
        } = req.body;

                if (
    !customerName ||
    !customerPhone ||
    !bookingService ||
    !bookingDate ||
    !bookingTime
) {

    return res.status(400).json({

        success: false,

        message:
            "All booking fields are required."

    });

}
        /* ADMIN CREDENTIALS */

        const ADMIN_USERNAME =
            "admin";


        const ADMIN_PASSWORD =
            "NRS@2026";


        /* CHECK LOGIN */

        if (

            username ===
            ADMIN_USERNAME

            &&

            password ===
            ADMIN_PASSWORD

        ) {

            return res.json({

                success:
                    true,

                message:
                    "Login successful."

            });

        }


        /* WRONG LOGIN */

        res.status(401).json({

            success:
                false,

            message:
                "Invalid username or password."

        });

    }
);

/* =========================
   STUDIO API
========================= */

app.get("/api/studio", (req, res) => {

    res.json({

        studioName:
            "New Rajasthan Studio",

        location:
            "Sewari, Rajasthan",

        services: [

            "Wedding Photography",

            "Pre Wedding",

            "Cinematic Film",

            "Drone Shoot"

        ],

        status:
            "Backend Connected Successfully"

    });

});


/* =========================
   CREATE BOOKING
========================= */

app.post("/api/bookings", (req, res) => {

    const {
        customerName,
        customerPhone,
        bookingService,
        bookingDate,
        bookingTime
    } = req.body;
if (
    !customerName ||
    !customerPhone ||
    !bookingService ||
    !bookingDate ||
    !bookingTime
) {

    return res.status(400).json({

        success: false,

        message:
            "All booking fields are required."

    });

}
const phoneRegex =
    /^[0-9]{10}$/;

if (!phoneRegex.test(customerPhone)) {

    return res.status(400).json({

        success: false,

        message:
            "Invalid phone number."

    });

}

    /* CHECK REQUIRED DATA */

    if (
        !customerName ||
        !customerPhone ||
        !bookingService ||
        !bookingDate ||
        !bookingTime
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Please provide all booking details."

        });

    }


    try {

        const createdAt =
            new Date().toISOString();


        const statement = db.prepare(`

            INSERT INTO bookings
            (
                customerName,
                customerPhone,
                service,
                date,
                time,
                status,
                createdAt
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                'Pending',
                ?
            )

        `);


        const result =
            statement.run(

                customerName,
                customerPhone,
                bookingService,
                bookingDate,
                bookingTime,
                createdAt

            );


        const booking =
            db.prepare(`
                SELECT *
                FROM bookings
                WHERE id = ?
            `).get(result.lastInsertRowid);


        console.log(
    "NEW DATABASE BOOKING:",
    booking
);


/* =========================
   WHATSAPP BOOKING
========================= */

const whatsappNumber =
    "919784064563";

const whatsappMessage =
    createWhatsAppMessage(
        booking
    );

const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(
        whatsappMessage
    );


/* =========================
   SEND RESPONSE
========================= */

res.status(201).json({

    success: true,

    message:
        "Booking saved successfully!",

    booking:
        booking,

    whatsappURL:
        whatsappURL

});

    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Database error."

        });

    }

});


/* =========================
   GET ALL BOOKINGS
========================= */

app.get("/api/bookings", (req, res) => {

    try {

        const bookings =
            db.prepare(`
                SELECT *
                FROM bookings
                ORDER BY id DESC
            `).all();


        res.json({

            success: true,

            total:
                bookings.length,

            bookings:
                bookings

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Database error."

        });

    }

});


/* =========================
   GET SINGLE BOOKING
========================= */

app.get("/api/bookings/:id", (req, res) => {

    const bookings =
        readBookings();

    const id =
        Number(req.params.id);


    const booking =
        bookings.find(
            item => item.id === id
        );


    if (!booking) {

        return res.status(404).json({

            success: false,

            message:
                "Booking not found."

        });

    }


    res.json({

        success: true,

        booking:
            booking

    });

});


/* =========================
   UPDATE BOOKING STATUS
========================= */

app.patch(
    "/api/bookings/:id/status",
    (req, res) => {

        const id =
            Number(req.params.id);

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "Pending",
            "Confirmed",
            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid booking status."

            });

        }


        try {

            const booking =
                db.prepare(`
                    SELECT *
                    FROM bookings
                    WHERE id = ?
                `).get(id);


            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Booking not found."

                });

            }


            db.prepare(`
                UPDATE bookings
                SET
                    status = ?
                WHERE id = ?
            `).run(
                status,
                id
            );


            const updatedBooking =
                db.prepare(`
                    SELECT *
                    FROM bookings
                    WHERE id = ?
                `).get(id);


            res.json({

                success: true,

                message:
                    "Booking status updated.",

                booking:
                    updatedBooking

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                success: false,

                message:
                    "Could not update booking."

            });

        }

    }
);


/* =========================
   DELETE BOOKING
========================= */

app.delete(
    "/api/bookings/:id",
    (req, res) => {

        const id =
            Number(req.params.id);


        try {

            const booking =
                db.prepare(`
                    SELECT *
                    FROM bookings
                    WHERE id = ?
                `).get(id);


            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Booking not found."

                });

            }


            db.prepare(`
                DELETE FROM bookings
                WHERE id = ?
            `).run(id);


            res.json({

                success: true,

                message:
                    "Booking deleted successfully.",

                booking:
                    booking

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                success: false,

                message:
                    "Could not delete booking."

            });

        }

    }
);

/* =========================
   BOOKING STATISTICS
========================= */

app.get(
    "/api/bookings/stats",
    (req, res) => {

        try {

            const total =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM bookings
                `).get().count;


            const pending =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM bookings
                    WHERE status = 'Pending'
                `).get().count;


            const confirmed =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM bookings
                    WHERE status = 'Confirmed'
                `).get().count;


            const cancelled =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM bookings
                    WHERE status = 'Cancelled'
                `).get().count;


            res.json({

                success: true,

                stats: {

                    total,
                    pending,
                    confirmed,
                    cancelled

                }

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                success: false,

                message:
                    "Could not load statistics."

            });

        }

    }
);


/* =========================
   SERVER
========================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);
const helmet =
    require("helmet");

app.use(helmet());

const rateLimit =
    require("express-rate-limit");
    const bookingLimiter =
    rateLimit({

        windowMs:
            15 * 60 * 1000,

        max: 20,

        message: {

            success: false,

            message:
                "Too many booking requests. Please try again later."

        }

    });