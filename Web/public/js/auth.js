// ======================================
// LOGIN
// ======================================
if (window.location.pathname.includes("login.html")) {

    const form = document.querySelector("#loginForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const user = document.querySelector("#user").value.trim();
            const pass = document.querySelector("#pass").value.trim();

            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user, pass })
                });

                const data = await res.json();

                if (!data.ok) {
                    return alert("⚠️ " + (data.error || "Error al iniciar sesión"));
                }

                // Guardar sesión
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirigir al dashboard
                window.location.href = "/views/dashboard.html";

            } catch (err) {
                console.error(err);
                alert("⚠️ Error al conectar con el servidor");
            }
        });
    }
}




// ======================================
// REGISTRO
// ======================================
if (window.location.pathname.includes("register.html")) {

    const form = document.querySelector("#registerForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const user  = document.querySelector("#user").value.trim();
            const email = document.querySelector("#email").value.trim();
            const pass  = document.querySelector("#pass").value.trim();

            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user, email, pass })
                });

                const data = await res.json();

                if (!data.ok) {
                    return alert("⚠️ " + (data.error || "No se pudo registrar"));
                }

                alert("🎉 Cuenta creada exitosamente. Inicia sesión");
                window.location.href = "/views/login.html";

            } catch (err) {
                console.error(err);
                alert("⚠️ Error al conectar con el servidor");
            }
        });
    }
}
