(() => {
  const ready = () => {
    const visuals = document.querySelectorAll('.art-visual');
    if (!visuals.length) return;

    let modal = document.querySelector('.art-zoom-modal');

    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'art-zoom-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="art-zoom-dialog" role="dialog" aria-modal="true" aria-label="Visual ampliado">
          <button class="art-zoom-close" type="button" aria-label="Cerrar ampliación">×</button>
          <div class="art-zoom-content ds-page"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const content = modal.querySelector('.art-zoom-content');
    const closeButton = modal.querySelector('.art-zoom-close');

    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('art-zoom-open');
      content.replaceChildren();
    };

    closeButton.addEventListener('click', close);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        close();
      }
    });

    visuals.forEach((visual) => {
      if (visual.querySelector('.art-zoom-btn')) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'art-zoom-btn';
      button.setAttribute('aria-label', 'Ampliar imagen');
      button.title = 'Ampliar visual';
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5"></circle>
          <path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"></path>
        </svg>
      `;

      button.addEventListener('click', () => {
        const clone = visual.cloneNode(true);
        clone.querySelector('.art-zoom-btn')?.remove();

        content.replaceChildren(clone);
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('art-zoom-open');
        closeButton.focus();
      });

      visual.appendChild(button);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
