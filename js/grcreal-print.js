/* GRCREAL corporate print */
(() => {
  'use strict';

  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();

  const formatDate = () => new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date());

  function firstVisible(selectors) {
    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        if (node.offsetParent !== null) {
          const value = clean(node.textContent);
          if (value.length > 15) return value.slice(0, 500);
        }
      }
    }
    return '';
  }

  function summary(kind) {
    if (kind === 'checklist') {
      const score = firstVisible(['#chkScore', '.chk-score', '[id*="Score"]', '[class*="score"]']);
      const gaps = firstVisible(['#chkGaps', '.chk-gaps', '[id*="Gaps"]']);
      const items = [];
      if (score) items.push(['Estado visible', score]);
      if (gaps) items.push(['Brechas visibles', gaps]);
      return items.length ? items : [[
        'Estado del informe',
        'La impresión refleja las respuestas y resultados visibles en el momento de su generación.'
      ]];
    }

    const result = firstVisible([
      '[id*="resultado"]', '[id*="result"]', '[class*="resultado"]',
      '[class*="result"]', '[id*="summary"]', '[class*="summary"]',
      '[id*="resumen"]', '[class*="resumen"]'
    ]);

    return [[
      result ? 'Resultado visible' : 'Estado del informe',
      result || 'La impresión recoge los datos, tablas y resultados visibles en el momento de su generación.'
    ]];
  }

  function createReportShell() {
    if (document.querySelector('.grc-print-report-header')) return;

    const body = document.body;
    const kind = body.dataset.reportKind || 'tool';
    const reportItems = summary(kind);

    const header = document.createElement('section');
    header.className = 'grc-print-report-header';
    header.innerHTML = `
      <div class="grc-print-brand">
        <div>
          <span class="grc-print-brand-name">GRCREAL</span>
          <span class="grc-print-brand-group">OpenTrust Group</span>
        </div>
        <span class="grc-print-document-type">${body.dataset.reportType || 'Informe'}</span>
      </div>
      <div class="grc-print-heading">
        <span>${body.dataset.reportFramework || ''}</span>
        <h1>${body.dataset.reportTitle || document.title}</h1>
        <p>${kind === 'checklist'
          ? 'Autoevaluación orientativa. Las respuestas deben contrastarse con alcance, criterio y evidencia suficiente.'
          : 'Ficha técnica orientativa. Los datos, cálculos y conclusiones requieren validación profesional.'}</p>
      </div>
      <div class="grc-print-meta">
        <div><span>Generado</span><strong data-grc-date></strong></div>
        <div><span>Origen</span><strong>${location.hostname || 'grcreal.com'}</strong></div>
        <div><span>Privacidad</span><strong>Procesamiento local</strong></div>
      </div>
      <div class="grc-print-summary">
        ${reportItems.map(([label, value]) => `
          <div><span>${label}</span><p>${value}</p></div>
        `).join('')}
      </div>
    `;

    const footer = document.createElement('footer');
    footer.className = 'grc-print-report-footer';
    footer.innerHTML = `
      <span>© 2026 GRCreal · Todos los derechos reservados · OpenTrust Group</span>
      <span>Documento generado desde grcreal.com</span>
    `;

    const card = document.querySelector('.card') || document.body;
    card.insertBefore(header, card.firstChild);
    card.appendChild(footer);
  }

  function syncFields() {
    document.querySelectorAll('[data-grc-date]').forEach(node => node.textContent = formatDate());

    document.querySelectorAll('textarea').forEach(field => {
      field.textContent = field.value;
    });

    document.querySelectorAll('input').forEach(field => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.toggleAttribute('checked', field.checked);
      } else {
        field.setAttribute('value', field.value);
      }
    });

    document.querySelectorAll('select').forEach(select => {
      Array.from(select.options).forEach(option => {
        option.toggleAttribute('selected', option.selected);
      });
    });
  }

  function printReport(event) {
    if (event) event.preventDefault();
    createReportShell();
    syncFields();
    window.print();
  }

  document.addEventListener('DOMContentLoaded', () => {
    createReportShell();
    document.querySelectorAll('[data-grc-print]').forEach(node => {
      node.addEventListener('click', printReport);
    });
  });

  window.addEventListener('beforeprint', () => {
    createReportShell();
    syncFields();
  });

  window.GRCPrint = { print: printReport };
})();
