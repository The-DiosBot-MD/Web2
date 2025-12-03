async function loadComponent(id, file) {
    const container = document.getElementById(id);
    if (!container) return;
    const res = await fetch(`/components/${file}`);
    container.innerHTML = await res.text();
}

// Cargar sidebar, header y footer automáticamente
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("sidebar-container", "sidebar.html");
    loadComponent("header-container", "header.html");
    loadComponent("footer-container", "footer.html");
});
