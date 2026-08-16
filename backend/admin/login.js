const loginForm =
    document.getElementById(
        "loginForm"
    );


loginForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const username =
            document.getElementById(
                "username"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        const message =
            document.getElementById(
                "loginMessage"
            );


        message.innerText =
            "Checking login...";


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/admin/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                username:
                                    username,

                                password:
                                    password

                            })

                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                message.innerText =
                    data.message;

                return;

            }


            /* SAVE LOGIN */

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            /* OPEN DASHBOARD */

            window.location.href =
                "admin.html";


        } catch (error) {

            console.error(
                error
            );

            message.innerText =
                "Server connection failed.";

        }

    }
);