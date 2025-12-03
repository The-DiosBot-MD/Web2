document.addEventListener("DOMContentLoaded", () => {

    // LOGIN
    const loginForm = document.querySelector("#loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
            alert("Iniciando sesión... (aún sin backend)");
        });
    }

    // REGISTRO
    const registerForm = document.querySelector("#registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", e => {
            e.preventDefault();
            alert("Registrando cuenta... (aún sin backend)");
        });
    }

});
