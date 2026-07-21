/* GRCREAL · responsive móvil de tablas y visuales */
(() => {
  'use strict';

  const BREAKPOINT = 900;

  function addHint(afterNode, text) {
    if (!afterNode || afterNode.nextElementSibling?.classList.contains('grc-mobile-scroll-hint')) return;
    const hint = document.createElement('div');
    hint.className = 'grc-mobile-scroll-hint';
    hint.textContent = text;
    afterNode.insertAdjacentElement('afterend', hint);
  }

  function headersFor(table) {
    const headerRow = table.tHead?.rows?.[0] || table.rows?.[0];
    if (!headerRow) return [];
    return Array.from(headerRow.cells).map((cell, index) => {
      const value = cell.textContent.replace(/\s+/g, ' ').trim();
      return value || `Campo ${index + 1}`;
    });
  }

  function isOperationalTable(table) {
    const operationalRoot = table.closest(
      'form, [contenteditable="true"], ' +
      '.chk-controls, .checklist-app, .checklist-tool, ' +
      '.bia-app, .ar-app, .ptr-app, .md-app, .prov-app, .ai-app, ' +
      '.herramienta-app, .tool-app, [data-tool-app]'
    );

    if (operationalRoot) return true;

    return Boolean(
      table.querySelector('input, select, textarea, button, [contenteditable="true"]')
    );
  }

  function tableShape(table) {
    const rows = Array.from(table.rows || []);
    const columns = rows.reduce((max, row) => Math.max(max, row.cells.length), 0);
    const bodyRows = table.tBodies?.length
      ? Array.from(table.tBodies).reduce((sum, body) => sum + body.rows.length, 0)
      : Math.max(0, rows.length - 1);
    return { columns, bodyRows };
  }

  function canStackTable(table) {
    const { columns, bodyRows } = tableShape(table);

    return (
      !isOperationalTable(table) &&
      columns >= 2 &&
      columns <= 4 &&
      bodyRows >= 1
    );
  }

  function removeScrollHint(table) {
    const wrap = table.closest('.grc-mobile-table-scroll');
    const hint = wrap?.nextElementSibling;
    if (hint?.classList.contains('grc-mobile-scroll-hint')) hint.remove();
  }

  function stackTable(table) {
    if (table.classList.contains('grc-mobile-stack-table')) return;

    const headers = headersFor(table);
    const bodyRows = table.tBodies?.length
      ? Array.from(table.tBodies).flatMap(body => Array.from(body.rows))
      : Array.from(table.rows).slice(table.tHead ? 0 : 1);

    bodyRows.forEach(row => {
      Array.from(row.cells).forEach((cell, index) => {
        cell.setAttribute('data-grc-label', headers[index] || `Campo ${index + 1}`);
      });
    });

    table.classList.add('grc-mobile-stack-table');
    table.setAttribute('data-grc-mobile-mode', 'cards');

    const wrap = table.closest('.grc-mobile-table-scroll');
    if (wrap) {
      wrap.classList.add('grc-mobile-stack-table-wrap');
      wrap.removeAttribute('tabindex');
      wrap.removeAttribute('role');
      wrap.removeAttribute('aria-label');
    }

    removeScrollHint(table);
  }

  function tableIsWide(table) {
    const { columns } = tableShape(table);
    return columns >= 3 || table.scrollWidth > window.innerWidth - 32;
  }

  function wrapOperationalTable(table) {
    table.classList.add('grc-operational-table');
    if (table.closest('.grc-mobile-table-scroll')) return;
    if (!tableIsWide(table)) return;

    const wrap = document.createElement('div');
    wrap.className = 'grc-mobile-table-scroll';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Tabla desplazable horizontalmente');
    wrap.tabIndex = 0;
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
    addHint(wrap, 'Desliza para ver toda la tabla');
  }

  function enhanceTables() {
    document.querySelectorAll('table').forEach(table => {
      if (canStackTable(table)) {
        stackTable(table);
      } else {
        wrapOperationalTable(table);
      }
    });
  }

  function svgComplexity(svg) {
    const viewBox = svg.viewBox?.baseVal;
    const width = viewBox?.width || Number(svg.getAttribute('width')) || 0;
    const textCount = svg.querySelectorAll('text,foreignObject').length;
    const nodeCount = svg.querySelectorAll('rect,path,line,polyline,polygon,circle,ellipse').length;
    return width >= 900 || textCount >= 7 || nodeCount >= 14;
  }

  function wrapVisuals() {
    document.querySelectorAll('.art-visual, .grc-infra-visual').forEach(visual => {
      const svg = visual.querySelector(':scope > svg, svg');
      if (!svg || !svgComplexity(svg)) return;
      visual.classList.add('grc-mobile-complex-visual');
      if (visual.closest('.grc-mobile-visual-scroll')) return;

      const wrap = document.createElement('div');
      wrap.className = 'grc-mobile-visual-scroll';
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Diagrama desplazable horizontalmente');
      wrap.tabIndex = 0;
      visual.parentNode.insertBefore(wrap, visual);
      wrap.appendChild(visual);
      addHint(wrap, 'Desliza para recorrer el gráfico');
    });
  }

  function wrapCanvas() {
    document.querySelectorAll('canvas').forEach(canvas => {
      if (canvas.closest('.grc-mobile-chart-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'grc-mobile-chart-wrap';
      canvas.parentNode.insertBefore(wrap, canvas);
      wrap.appendChild(canvas);
    });
  }

  function enhance() {
    if (window.innerWidth > BREAKPOINT) return;
    enhanceTables();
    wrapVisuals();
    wrapCanvas();
  }

  document.addEventListener('DOMContentLoaded', enhance);
  window.addEventListener('load', enhance, { once: true });

  const observer = new MutationObserver(() => {
    if (window.innerWidth <= BREAKPOINT) enhance();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
