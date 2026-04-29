#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import shutil
from datetime import datetime

# ============================================================
# DICCIONARIO DE REEMPLAZOS
# Clave: nombre del archivo
# Valor: texto que debe quedar DENTRO del <strong> (sin link)
# ============================================================

REPLACEMENTS = {
    "active-directory-seguridad.html": "ya es un riesgo.",
    "aiact.html": "es momento de ponerse al día.",
    "analisis-de-riesgos-util.html": "es momento de revisarlo con criterio.",
    "auditoria-continuidad-que-revisa.html": "saberlo antes de que llegue el auditor marca la diferencia.",
    "auditoria-ens.html": "revisarlo antes de que empiece el proceso es la decisión inteligente.",
    "backup-no-es-recuperacion.html": "Probarlo antes del incidente marca la diferencia.",
    "borrado-seguro-ens.html": "el problema ya existe antes de la auditoría.",
    "ciberseguridad-consejo-administracion.html": "el consejo necesita entenderlo mejor.",
    "cumplir-no-es-estar-preparado.html": "la diferencia está en los controles reales.",
    "datos-ia-ubicacion-tratamiento.html": "es momento de revisar los acuerdos con proveedores.",
    "documentacion-tecnica-infraestructura.html": "la documentación no es burocracia, es resiliencia.",
    "draft.html": "actuar con criterio marca la diferencia.",
    "el-fallo-es-de-gobierno.html": "el gobierno de la seguridad empieza por decidir.",
    "el-incidente-ocurrio.html": "prepararse antes marca la diferencia entre gestionar o improvisar.",
    "ens-medidas-seguridad-criticas.html": "Mejor corregir antes que justificar después.",
    "ens-proveedores-privados.html": "Antes de licitar, no después.",
    "ens-vs-iso27001-diferencias.html": "Duplicar sistemas no lo es.",
    "gestion-identidades.html": "la identidad es crítica y hay que revisarla.",
    "grc-pymes-sin-expertos.html": "empezar por lo básico marca la diferencia.",
    "hardening-windows-gpo.html": "Verificarlo es el único camino.",
    "iso22301-vs-bcp-casero.html": "saberlo antes del incidente marca la diferencia.",
    "iso27001-auditoria-stage1-stage2.html": "Mejor corregir antes que justificar después.",
    "iso27001-declaracion-aplicabilidad.html": "La DoA debe reflejar el riesgo real.",
    "iso27001-lo-que-nadie-te-explica.html": "conviene plantearlo bien antes de que empiece.",
    "iso27001-mantenimiento-sgsi.html": "El SGSI debe mantenerse vivo antes de la auditoría.",
    "iso42001-gestion-ia.html": "ordenarlo antes de que escale es la decisión inteligente.",
    "iso42001-sesgos-ia-empresas.html": "Medirlo es el primer paso para gobernarlo.",
    "it-no-es-responsable-seguridad.html": "hay un problema de gobierno que revisar.",
    "nis2-entidades-esenciales-importantes.html": "Conviene tenerlo claro antes de que lo pregunte el regulador.",
    "nis2-medidas-tecnicas-articulo21.html": "La evidencia debe existir antes de la inspección.",
    "nis2-notificacion-incidentes.html": "El proceso debe estar preparado antes del incidente.",
    "nis2-quien-aplica.html": "mejor revisarlo antes de que llegue la inspección.",
    "niveles-ens.html": "conviene hacerlo con criterio.",
    "phishing-2026.html": "La preparación también debe evolucionar.",
    "plan-continuidad-probado.html": "hay que probarlo antes del incidente.",
    "rto-rpo-realidad.html": "Medirlo antes evita improvisar después.",
    "security-by-design.html": "hacerlo bien desde el principio marca la diferencia.",
    "segmentacion-red-real.html": "conviene revisar la arquitectura.",
    "vciso-que-es.html": "avancemos con criterio.",
    "zero-trust-on-prem.html": "es momento de actuar.",
}

# ============================================================
# FUNCIÓN PRINCIPAL
# ============================================================

def modificar_archivos(directorio):
    # Crear carpeta de backup con timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = os.path.join(directorio, f"backup_originales_{timestamp}")
    os.makedirs(backup_dir, exist_ok=True)
    print(f"[INFO] Backup creado en: {backup_dir}\n")

    modificados = 0
    no_encontrados = 0
    errores = 0

    for archivo, nuevo_texto in REPLACEMENTS.items():
        ruta_archivo = os.path.join(directorio, archivo)

        if not os.path.exists(ruta_archivo):
            print(f"[ERROR] No se encontró: {archivo}")
            no_encontrados += 1
            continue

        # Leer contenido original
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            contenido = f.read()

        # Hacer backup
        backup_path = os.path.join(backup_dir, archivo)
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(contenido)

        # Patrón regex para buscar y reemplazar
        # Busca: <strong><a href="/contacto.html"> cualquier texto </a></strong>
        # Reemplaza: <strong>nuevo_texto</strong>
        patron = r'<strong><a href="/contacto\.html">.*?</a></strong>'
        reemplazo = f'<strong>{nuevo_texto}</strong>'

        nuevo_contenido = re.sub(patron, reemplazo, contenido, flags=re.DOTALL)

        # Verificar si hubo cambio
        if nuevo_contenido == contenido:
            print(f"[SIN CAMBIO] {archivo} (no se encontró el patrón)")
        else:
            # Escribir archivo modificado
            with open(ruta_archivo, 'w', encoding='utf-8') as f:
                f.write(nuevo_contenido)
            print(f"[MODIFICADO] {archivo}")
            modificados += 1

    # Resumen final
    print("\n" + "="*50)
    print("RESUMEN:")
    print(f"  - Modificados: {modificados}")
    print(f"  - No encontrados: {no_encontrados}")
    print(f"  - Errores: {errores}")
    print(f"  - Backup en: {backup_dir}")
    print("="*50)

# ============================================================
# EJECUCIÓN
# ============================================================

if __name__ == "__main__":
    # Cambia esta ruta por la tuya
    # Ejemplos:
    # Windows: r"C:\Users\TuUsuario\Documentos\articulos"
    # Linux/Mac: "/home/tuusuario/articulos"
    # Si los archivos están en el mismo directorio que el script:
    DIRECTORIO = "."  # "." significa "el mismo directorio donde está el script"

    print("="*50)
    print("SCRIPT DE MODIFICACIÓN DE CTAs")
    print("="*50)
    print(f"Directorio de trabajo: {os.path.abspath(DIRECTORIO)}")
    print("")

    confirmar = input("¿Quieres hacer una copia de seguridad y modificar los archivos? (s/n): ")
    if confirmar.lower() == 's':
        modificar_archivos(DIRECTORIO)
    else:
        print("Cancelado. No se ha modificado nada.")