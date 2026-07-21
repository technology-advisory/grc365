/* ============================================================
   GRCreal · herramientas.js
   Renderiza el índice de /herramientas/ desde tools.json.
   Si el fetch falla (p. ej. abriendo el fichero en local con
   file://), usa el FALLBACK de abajo para que se vea igual.
   ============================================================ */
(function () {
  "use strict";

  // Ajusta la ruta a tu estructura real.
  var TOOLS_JSON = "../data/tools.json";

  // ---- Fallback (mismo esquema que tools.json). Mantenlo sincronizado o bórralo. ----
  var FALLBACK = {"features":[{"icono":"01","titulo":"Trabajan en local","texto":"Los datos permanecen en el navegador mientras utilizas la página. No se envían a GRCREAL."},{"icono":"02","titulo":"Metodología visible","texto":"Cada cálculo explica su criterio y sus límites. Ningún semáforo sustituye el juicio profesional."},{"icono":"03","titulo":"Datos exportables","texto":"Puedes generar un documento de trabajo para revisar, completar y conservar como evidencia."},{"icono":"04","titulo":"Sin falsas certificaciones","texto":"El resultado es orientativo. No acredita cumplimiento, conformidad ni madurez por sí solo."}],"nota":{"texto":"Una herramienta GRC no debería esconder la decisión detrás de un color.<br><br><strong>Estas utilidades ayudan a ordenar información, detectar inconsistencias y preparar una revisión. La organización sigue teniendo que validar alcance, escalas, responsables y evidencia.</strong><br><br>El resultado es un punto de trabajo, no una conclusión automática."},"tools":[{"id":"ai-act-clasificador","titulo":"Clasificador orientativo · AI Act","tag":"Reglamento (UE) 2024/1689 · IA","descripcion":"Clasificación preliminar del AI Act: artículo 5, alto riesgo, excepción del artículo 6.3, transparencia, GPAI y calendario vigente.","badges":["AI Act","Art. 5","Anexo III","Art. 50","GPAI"],"enlace":"ai-act-clasificador/index.html","bloqueado":false,"salida":"Clasificación preliminar y preguntas pendientes","tipo":"Orientación regulatoria"},{"id":"bia","titulo":"BIA · Análisis de Impacto de Negocio","tag":"ISO 22301 · Continuidad","descripcion":"Documenta procesos, criticidad, RTO, RPO y concentración de dependencias con validación de datos y referencias corregidas.","badges":["ISO 22301","RTO","RPO","Dependencias"],"enlace":"bia/index.html","bloqueado":false,"salida":"Registro BIA para validación","tipo":"Recogida y priorización"},{"id":"analisis-riesgos","titulo":"Registro y matriz de riesgos","tag":"ISO 27001 · ISO 27005 · ENS","descripcion":"Prioriza riesgos con una matriz cualitativa 5×5 explícita; no confunde prioridad inicial con riesgo residual.","badges":["Risk Register","P × I","Propietario","Tratamiento"],"enlace":"analisis-riesgos/index.html","bloqueado":false,"salida":"Registro priorizado de riesgos","tipo":"Análisis cualitativo"},{"id":"plan-tratamiento","titulo":"Plan de Tratamiento de Riesgos","tag":"ISO 27001 · ENS · NIS2","descripcion":"Plan de acciones con responsables, controles y evidencia de cierre verificado; aporta trazabilidad, pero no sustituye la SoA.","badges":["PTR","Controles","Responsables","Evidencia"],"enlace":"plan-tratamiento/index.html","bloqueado":false,"salida":"Plan de acciones y seguimiento","tipo":"Gobierno del tratamiento"},{"id":"matriz-dependencias","titulo":"Matriz de Dependencias","tag":"ISO 22301 · Arquitectura · Resiliencia","descripcion":"Mapea procesos y recursos y señala candidatos a SPOF, sin confirmarlos automáticamente.","badges":["Dependencias","SPOF candidato","Resiliencia","Arquitectura"],"enlace":"matriz-dependencias/index.html","bloqueado":false,"salida":"Mapa de dependencias y concentraciones","tipo":"Análisis de arquitectura"},{"id":"gestion-proveedores","titulo":"Evaluación inicial de proveedores","tag":"ISO 27001 · NIS2 · DORA","descripcion":"Triage transparente de proveedores con criticidad, acceso privilegiado, cláusulas, aseguramiento y vigencia de revisión.","badges":["Third Party Risk","A.5.19","NIS2","Due Diligence"],"enlace":"gestion-proveedores/index.html","bloqueado":false,"salida":"Registro de revisión de terceros","tipo":"Triage de proveedores"}]};

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function renderFeatures(features) {
    var wrap = document.getElementById("hrFeatures");
    wrap.innerHTML = "";
    (features || []).forEach(function (f) {
      var c = el("div", "hr-feat");
      c.appendChild(el("div", "hr-feat-ico", f.icono || "•"));
      c.appendChild(el("div", "hr-feat-t", f.titulo || ""));
      c.appendChild(el("p", "hr-feat-x", f.texto || ""));
      wrap.appendChild(c);
    });
  }

  function renderNota(nota) {
    var wrap = document.getElementById("hrNota");
    if (!nota || !nota.texto) { wrap.style.display = "none"; return; }
    wrap.innerHTML = "";
    wrap.appendChild(el("div", "hr-nota-label", "Nota del autor"));
    wrap.appendChild(el("p", "hr-nota-x", nota.texto));
  }

  function renderTools(tools) {
    var wrap = document.getElementById("hrTools");
    wrap.innerHTML = "";
    (tools || []).forEach(function (t, i) {
      var ref = "REF." + String(i + 1).padStart(2, "0");
      var locked = !!t.bloqueado;
      var card = el("article", "hr-card" + (locked ? " locked" : ""));

      if (locked) {
        card.appendChild(el("div", "hr-stamp", t.mensaje_bloqueo || "Próximamente"));
      }

      var top = el("div", "hr-card-top");
      top.appendChild(el("span", "hr-ref", ref));
      top.appendChild(el("span", "hr-tag", t.tag || ""));
      card.appendChild(top);

      card.appendChild(el("h2", null, t.titulo || ""));
      card.appendChild(el("p", "hr-desc", t.descripcion || ""));

      if (t.tipo || t.salida) {
        var meta = el("div", "hr-tool-meta");
        if (t.tipo) meta.appendChild(el("span", "hr-tool-type", t.tipo));
        if (t.salida) meta.appendChild(el("span", "hr-tool-output", "Salida: " + t.salida));
        card.appendChild(meta);
      }

      if (t.badges && t.badges.length) {
        var b = el("div", "hr-badges");
        t.badges.forEach(function (x) { b.appendChild(el("span", "hr-badge", x)); });
        card.appendChild(b);
      }

		// Mostrar "Abrir herramienta →" solo si tiene enlace
		if (t.enlace) {
		  var a = el("a", "hr-cta", "Abrir herramienta →");

		  if (locked) {
			a.classList.add("disabled");
			a.setAttribute("aria-disabled", "true");
			a.removeAttribute("href");
		  } else {
			a.href = t.enlace;
		  }

		  card.appendChild(a);
		} else {
		  card.appendChild(el("div", "hr-soon", "En preparación"));
		}

		wrap.appendChild(card);
		});
		}

  function render(data) {
    renderFeatures(data.features);
    renderNota(data.nota);
    renderTools(data.tools);
  }

  fetch(TOOLS_JSON, { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () { render(FALLBACK); });
})();