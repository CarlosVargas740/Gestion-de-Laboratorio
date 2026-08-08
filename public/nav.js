(function () {
  const navButtons = document.querySelectorAll('.nav-btn[data-view]');
  const views = document.querySelectorAll('.view');

  function showView(viewId) {
    views.forEach((view) => {
      view.hidden = view.id !== viewId;
    });

    navButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.view === viewId);
    });

    // Al volver a Reportes, forzamos un resize de las gráficas de Chart.js:
    // si el canvas estuvo oculto (display:none) no tenía ancho/alto y el
    // dibujo salía en blanco.
    if (viewId === 'view-reportes' && typeof Chart !== 'undefined') {
      Object.values(Chart.instances || {}).forEach((instance) => instance.resize());
    }

    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  navButtons.forEach((button) => {
    button.addEventListener('click', () => showView(button.dataset.view));
  });

  // Al cargar la página por primera vez ningún <section class="view"> tenía
  // el atributo "hidden", así que todos se mostraban apilados uno tras otro
  // (reportes, agregar paciente, etc. "todo seguido"). showView() solo se
  // ejecutaba al hacer clic en un botón del menú. Con esta línea forzamos el
  // mismo comportamiento desde el primer render, dejando visible únicamente
  // la pestaña marcada como activa (o "Inicio" si ninguna lo está).
  const initialButton = document.querySelector('.nav-btn.active[data-view]') || navButtons[0];
  if (initialButton) {
    showView(initialButton.dataset.view);
  }
})();
