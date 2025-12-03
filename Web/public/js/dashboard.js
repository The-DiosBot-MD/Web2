document.addEventListener("DOMContentLoaded", () => {

    // NOMBRE DEL USUARIO SIMULADO (luego vendrá del backend)
    document.getElementById("username").textContent = "MikuUwU";

    // VALORES TEMPORALES
    document.getElementById("repoCount").textContent = "3";
    document.getElementById("activeInstances").textContent = "1";
    document.getElementById("totalInstances").textContent = "2";

    // GRÁFICO ROSADO
    const ctx = document.getElementById("statsChart");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
            datasets: [{
                label: "Instancias activas",
                data: [1, 1, 2, 3, 2, 4, 3],
            }]
        }
    });

});
