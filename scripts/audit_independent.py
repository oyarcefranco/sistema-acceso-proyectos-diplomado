# -*- coding: utf-8 -*-
"""
Auditoría Independiente de Calidad Final - Portal VcM USS
Auditor: Independent Quality Auditor
Objetivo: Contrastar y certificar la calidad final de la base de datos y la distribución estática (dist/)
"""

import os
import sys
import json
import re
import fitz # PyMuPDF

WORKSPACE = r"c:\Users\oyarc\OneDrive - Universidad San Sebastian\VCM\Sistema Acceso Proyectos diplomado"
DIST_DIR = os.path.join(WORKSPACE, "dist")
os.chdir(WORKSPACE)

print("="*80)
print("AUDITORÍA INDEPENDIENTE DE CALIDAD FINAL - PORTAL VCM USS")
print("Ambiente de Producción: dist/")
print("="*80)

# Cargar fuentes de datos
with open("src/data/iniciativas.json", "r", encoding="utf-8") as f:
    iniciativas = json.load(f)

with open("src/data/proyectosContinuidad.json", "r", encoding="utf-8") as f:
    continuidad = json.load(f)

with open("src/data/whitelist.json", "r", encoding="utf-8") as f:
    whitelist = json.load(f)

# Estructura de resultados de auditoría
audit_report = {
    "logos": {},
    "continuidad": {
        "programas": [],
        "versiones_total": 0,
        "encuestas_estudiantes": {"disponibles": 0, "no_disponibles": 0, "verificados": 0, "fallos": 0},
        "encuestas_organizaciones": {"disponibles": 0, "no_disponibles": 0, "verificados": 0, "fallos": 0},
        "detalle_versiones": []
    },
    "pth": {
        "total_pths": len(iniciativas),
        "total_proyectos": 0,
        "proyectos_auditados": [],
        "id_4829_auditado": False,
        "id_4829_detalle": {},
        "documentos_totales": 0,
        "documentos_validos": 0,
        "documentos_fallidos": 0
    },
    "urls_y_rutas": {
        "total_referencias_dist": 0,
        "rutas_validas": 0,
        "rutas_invalidas": 0,
        "errores": []
    },
    "tasa_error_global": 0.0
}

# ------------------------------------------------------------------------------
# 1. VERIFICACIÓN DE LOGOS OFICIALES EN dist/logos/
# ------------------------------------------------------------------------------
print("\n[FASE 1] AUDITORÍA DE LOGOS OFICIALES EN dist/logos/...")
required_logos = [
    "logo-vcm-uss.png",
    "vcm-fondo-blanco.png",
    "logo-uss-white.png",
    "USS_VcM_logo_responsive.png"
]

logo_audit = {}
logos_all_ok = True

for logo_name in required_logos:
    logo_path = os.path.join(DIST_DIR, "logos", logo_name)
    exists = os.path.exists(logo_path)
    size = os.path.getsize(logo_path) if exists else 0
    is_valid = exists and size > 0
    if not is_valid:
        logos_all_ok = False
        audit_report["urls_y_rutas"]["errores"].append(f"Logo no encontrado o vacío: {logo_path}")
    
    logo_audit[logo_name] = {
        "existe": exists,
        "tamano_bytes": size,
        "es_valido": is_valid,
        "ruta_relativa": f"logos/{logo_name}"
    }
    print(f"  - {logo_name:<30}: {'OK' if is_valid else 'FALLO'} ({size:,} bytes)")

audit_report["logos"] = logo_audit

# ------------------------------------------------------------------------------
# 2. VERIFICACIÓN DE ENCUESTAS DE CONTINUIDAD (4 Programas, 19 Versiones)
# ------------------------------------------------------------------------------
print("\n[FASE 2] AUDITORÍA DE ENCUESTAS DE CONTINUIDAD (4 PROGRAMAS, 19 VERSIONES)...")
total_versiones = 0

for prog in continuidad:
    prog_id = prog.get("id")
    prog_nombre = prog.get("nombre")
    versiones = prog.get("versiones", [])
    print(f"\n* Programa: {prog_nombre} (ID: {prog_id}) - {len(versiones)} Versiones:")
    
    audit_report["continuidad"]["programas"].append({
        "id": prog_id,
        "nombre": prog_nombre,
        "cantidad_versiones": len(versiones)
    })

    for ver in versiones:
        total_versiones += 1
        id_num = ver.get("idNumero")
        ano = ver.get("ano")
        sede = ver.get("sede")
        docs = ver.get("documentos", {})
        
        # Archivo principal de versión
        archivo_principal = ver.get("archivo")
        arch_princ_ok = False
        if archivo_principal:
            arch_princ_dist = os.path.join(DIST_DIR, archivo_principal.lstrip("/"))
            if os.path.exists(arch_princ_dist) and os.path.getsize(arch_princ_dist) > 0:
                arch_princ_ok = True

        # Encuesta Estudiantes
        enc_est = docs.get("encuestaEstudiantes", {})
        disp_est = enc_est.get("disponible", False)
        arch_est = enc_est.get("archivo", "")
        estado_est = enc_est.get("estado", "")
        
        est_valido = False
        est_dist_path = ""
        est_size = 0
        est_pages = 0
        
        if disp_est:
            audit_report["continuidad"]["encuestas_estudiantes"]["disponibles"] += 1
            est_dist_path = os.path.join(DIST_DIR, arch_est.lstrip("/"))
            if os.path.exists(est_dist_path) and os.path.getsize(est_dist_path) > 0:
                est_size = os.path.getsize(est_dist_path)
                try:
                    pdf = fitz.open(est_dist_path)
                    est_pages = len(pdf)
                    pdf.close()
                    if est_pages > 0:
                        est_valido = True
                        audit_report["continuidad"]["encuestas_estudiantes"]["verificados"] += 1
                except Exception as e:
                    audit_report["urls_y_rutas"]["errores"].append(f"PDF inválido en {est_dist_path}: {e}")
            else:
                audit_report["continuidad"]["encuestas_estudiantes"]["fallos"] += 1
                audit_report["urls_y_rutas"]["errores"].append(f"Archivo encuesta estudiantes no existe en dist: {arch_est}")
        else:
            audit_report["continuidad"]["encuestas_estudiantes"]["no_disponibles"] += 1
            # Confirmar descripción descriptiva
            if estado_est and any(w in estado_est.lower() for w in ["no aplicada", "no disponible", "no cuenta"]):
                est_valido = True
            else:
                est_valido = False
                audit_report["urls_y_rutas"]["errores"].append(f"Estado no descriptivo en encuesta est id {id_num}: '{estado_est}'")

        # Encuesta Organizaciones
        enc_org = docs.get("encuestaOrganizaciones", {})
        disp_org = enc_org.get("disponible", False)
        arch_org = enc_org.get("archivo", "")
        estado_org = enc_org.get("estado", "")
        
        org_valido = False
        org_dist_path = ""
        org_size = 0
        org_pages = 0
        
        if disp_org:
            audit_report["continuidad"]["encuestas_organizaciones"]["disponibles"] += 1
            org_dist_path = os.path.join(DIST_DIR, arch_org.lstrip("/"))
            if os.path.exists(org_dist_path) and os.path.getsize(org_dist_path) > 0:
                org_size = os.path.getsize(org_dist_path)
                try:
                    pdf = fitz.open(org_dist_path)
                    org_pages = len(pdf)
                    pdf.close()
                    if org_pages > 0:
                        org_valido = True
                        audit_report["continuidad"]["encuestas_organizaciones"]["verificados"] += 1
                except Exception as e:
                    audit_report["urls_y_rutas"]["errores"].append(f"PDF inválido en {org_dist_path}: {e}")
            else:
                audit_report["continuidad"]["encuestas_organizaciones"]["fallos"] += 1
                audit_report["urls_y_rutas"]["errores"].append(f"Archivo encuesta organizaciones no existe en dist: {arch_org}")
        else:
            audit_report["continuidad"]["encuestas_organizaciones"]["no_disponibles"] += 1
            # Confirmar descripción descriptiva
            if estado_org and any(w in estado_org.lower() for w in ["no aplicada", "no disponible", "no cuenta"]):
                org_valido = True
            else:
                org_valido = False
                audit_report["urls_y_rutas"]["errores"].append(f"Estado no descriptivo en encuesta org id {id_num}: '{estado_org}'")

        version_info = {
            "programa": prog_id,
            "idNumero": id_num,
            "ano": ano,
            "sede": sede,
            "archivo_principal_valido": arch_princ_ok,
            "estudiantes": {
                "disponible": disp_est,
                "archivo": arch_est,
                "estado": estado_est,
                "tamano_bytes": est_size,
                "paginas": est_pages,
                "valido": est_valido
            },
            "organizaciones": {
                "disponible": disp_org,
                "archivo": arch_org,
                "estado": estado_org,
                "tamano_bytes": org_size,
                "paginas": org_pages,
                "valido": org_valido
            }
        }
        audit_report["continuidad"]["detalle_versiones"].append(version_info)
        
        status_est_str = f"DISPONIBLE ({est_size:,} bytes, {est_pages} pág)" if disp_est else f"NO DISPONIBLE ({estado_est})"
        status_org_str = f"DISPONIBLE ({org_size:,} bytes, {org_pages} pág)" if disp_org else f"NO DISPONIBLE ({estado_org})"
        print(f"    ID {id_num} ({ano} - {sede}):")
        print(f"      - Encuesta Estudiantes:    {status_est_str}")
        print(f"      - Encuesta Organizaciones: {status_org_str}")

audit_report["continuidad"]["versiones_total"] = total_versiones
print(f"\nResumen Continuidad:")
print(f"  Total Versiones Auditadas: {total_versiones}")
print(f"  Encuestas Estudiantes DISPONIBLES: {audit_report['continuidad']['encuestas_estudiantes']['disponibles']} (Verificados OK: {audit_report['continuidad']['encuestas_estudiantes']['verificados']})")
print(f"  Encuestas Estudiantes NO DISPONIBLES (con justificativo formal): {audit_report['continuidad']['encuestas_estudiantes']['no_disponibles']}")
print(f"  Encuestas Organizaciones DISPONIBLES: {audit_report['continuidad']['encuestas_organizaciones']['disponibles']} (Verificados OK: {audit_report['continuidad']['encuestas_organizaciones']['verificados']})")
print(f"  Encuestas Organizaciones NO DISPONIBLES (con justificativo formal): {audit_report['continuidad']['encuestas_organizaciones']['no_disponibles']}")

# ------------------------------------------------------------------------------
# 3. VERIFICACIÓN DE PROYECTOS PTH (2024-2025) Y DETALLE ID 4829
# ------------------------------------------------------------------------------
print("\n[FASE 3] AUDITORÍA DE PROYECTOS PTH 2024-2025 (INCLUYENDO ID 4829)...")

total_pth_proyectos = 0
pth_docs_totales = 0
pth_docs_validos = 0
pth_docs_fallidos = 0

for pth in iniciativas:
    sigla = pth.get("sigla")
    nombre_pth = pth.get("nombre")
    projs = pth.get("proyectos", [])
    rep_gen = pth.get("reportesGenerales", [])
    
    print(f"\n* PTH: {nombre_pth} ({sigla}) - {len(projs)} proyectos, {len(rep_gen)} reportes generales:")
    
    # Reportes generales
    for rg in rep_gen:
        arch_rg = rg.get("archivo", "")
        if arch_rg:
            pth_docs_totales += 1
            rg_dist = os.path.join(DIST_DIR, arch_rg.lstrip("/"))
            if os.path.exists(rg_dist) and os.path.getsize(rg_dist) > 0:
                try:
                    pdf = fitz.open(rg_dist)
                    if len(pdf) > 0:
                        pth_docs_validos += 1
                    pdf.close()
                except:
                    pth_docs_fallidos += 1
                    audit_report["urls_y_rutas"]["errores"].append(f"Reporte general inválido: {arch_rg}")
            else:
                pth_docs_fallidos += 1
                audit_report["urls_y_rutas"]["errores"].append(f"Reporte general no existe en dist: {arch_rg}")

    for pr in projs:
        total_pth_proyectos += 1
        pid = pr.get("idNumero")
        pnom = pr.get("nombre")
        ano = pr.get("ano")
        docs = pr.get("documentos", {})
        
        pr_audit = {
            "id": pid,
            "nombre": pnom,
            "ano": ano,
            "pth": sigla,
            "docs": {}
        }
        
        for dk, dv in docs.items():
            if isinstance(dv, dict) and dv.get("disponible") and dv.get("archivo"):
                pth_docs_totales += 1
                doc_file = dv.get("archivo")
                doc_dist = os.path.join(DIST_DIR, doc_file.lstrip("/"))
                doc_ok = False
                doc_size = 0
                doc_pages = 0
                
                if os.path.exists(doc_dist) and os.path.getsize(doc_dist) > 0:
                    doc_size = os.path.getsize(doc_dist)
                    try:
                        pdf = fitz.open(doc_dist)
                        doc_pages = len(pdf)
                        pdf.close()
                        if doc_pages > 0:
                            doc_ok = True
                            pth_docs_validos += 1
                    except Exception as e:
                        pth_docs_fallidos += 1
                        audit_report["urls_y_rutas"]["errores"].append(f"PDF PTH corrupto: {doc_file} ({e})")
                else:
                    pth_docs_fallidos += 1
                    audit_report["urls_y_rutas"]["errores"].append(f"PDF PTH inexistente en dist: {doc_file}")
                
                pr_audit["docs"][dk] = {
                    "archivo": doc_file,
                    "valido": doc_ok,
                    "tamano": doc_size,
                    "paginas": doc_pages
                }

        # Verificación especial ID 4829 (PN Hornopirén)
        if pid == 4829 or "4829" in str(pid) or "Hornopirén" in str(pnom):
            audit_report["pth"]["id_4829_auditado"] = True
            audit_report["pth"]["id_4829_detalle"] = {
                "id": pid,
                "nombre": pnom,
                "ano": ano,
                "pth": sigla,
                "documentos": pr_audit["docs"],
                "todos_validos": all(d.get("valido", False) for d in pr_audit["docs"].values())
            }
            print(f"  -> PROYECTO CLAVE AUDITADO: ID {pid} - {pnom}")
            for dk, dinfo in pr_audit["docs"].items():
                print(f"     Documento: {dk:<25} -> Archivo: {dinfo['archivo']} | Válido: {dinfo['valido']} | Tamaño: {dinfo['tamano']:,} bytes | Páginas: {dinfo['paginas']}")

        audit_report["pth"]["proyectos_auditados"].append(pr_audit)

audit_report["pth"]["total_proyectos"] = total_pth_proyectos
audit_report["pth"]["documentos_totales"] = pth_docs_totales
audit_report["pth"]["documentos_validos"] = pth_docs_validos
audit_report["pth"]["documentos_fallidos"] = pth_docs_fallidos

print(f"\nResumen PTH:")
print(f"  Total Proyectos PTH: {total_pth_proyectos}")
print(f"  Total Documentos PTH Auditados: {pth_docs_totales}")
print(f"  Documentos PTH Válidos en dist/: {pth_docs_validos}")
print(f"  Documentos PTH Fallidos: {pth_docs_fallidos}")
print(f"  Proyecto 4829 Hornopirén encontrado y auditado: {audit_report['pth']['id_4829_auditado']}")

# ------------------------------------------------------------------------------
# 4. AUDITORÍA EXHAUSTIVA DE TODAS LAS RUTAS Y ARCHIVOS EN dist/documentos/
# ------------------------------------------------------------------------------
print("\n[FASE 4] AUDITORÍA DE ARCHIVOS FÍSICOS EN dist/documentos/ Y COHERENCIA DE RUTAS...")

all_dist_files = []
for root, dirs, files in os.walk(DIST_DIR):
    for f in files:
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, DIST_DIR).replace("\\", "/")
        all_dist_files.append({
            "rel_path": rel_path,
            "full_path": full_path,
            "size": os.path.getsize(full_path)
        })

print(f"Total archivos en dist/: {len(all_dist_files)}")
pdf_files_in_dist = [f for f in all_dist_files if f["rel_path"].lower().endswith(".pdf")]
print(f"Total PDFs en dist/: {len(pdf_files_in_dist)}")

# Revisar integridad física de todos los PDFs en dist/
dist_pdf_errors = 0
dist_pdf_total_pages = 0
dist_pdf_total_bytes = 0

for pf in pdf_files_in_dist:
    dist_pdf_total_bytes += pf["size"]
    if pf["size"] == 0:
        dist_pdf_errors += 1
        audit_report["urls_y_rutas"]["errores"].append(f"PDF en dist tiene 0 bytes: {pf['rel_path']}")
        continue
    try:
        doc = fitz.open(pf["full_path"])
        p_count = len(doc)
        doc.close()
        if p_count == 0:
            dist_pdf_errors += 1
            audit_report["urls_y_rutas"]["errores"].append(f"PDF en dist tiene 0 páginas: {pf['rel_path']}")
        else:
            dist_pdf_total_pages += p_count
    except Exception as e:
        dist_pdf_errors += 1
        audit_report["urls_y_rutas"]["errores"].append(f"Error abriendo PDF en dist: {pf['rel_path']} - {e}")

print(f"PDFs verificados físicamente en dist/: {len(pdf_files_in_dist)}")
print(f"  Válidos: {len(pdf_files_in_dist) - dist_pdf_errors}")
print(f"  Corruptos/vacíos: {dist_pdf_errors}")
print(f"  Páginas totales de PDFs en dist/: {dist_pdf_total_pages:,}")
print(f"  Volumen total de PDFs en dist/: {dist_pdf_total_bytes / (1024*1024):.2f} MB")

# Verificar si el código en producción busca rutas coherentes
# Buscamos en dist/assets/index-*.js referencias a rutas de documentos o logos
js_bundles = [f for f in all_dist_files if f["rel_path"].startswith("assets/") and f["rel_path"].endswith(".js")]
print(f"\nAnalizando bundle de producción JS: {[b['rel_path'] for b in js_bundles]}...")

for jb in js_bundles:
    with open(jb["full_path"], "r", encoding="utf-8", errors="ignore") as jf:
        js_content = jf.read()
    
    # Verificar referencias a logos
    for l in required_logos:
        if l in js_content:
            print(f"  - Logo '{l}' referenciado explícitamente en el bundle JS.")
        else:
            print(f"  - Logo '{l}' no aparece como string literal en JS (puede ser dinámico o vía fallback).")

# ------------------------------------------------------------------------------
# 5. CÁLCULO DE TASA DE ERROR GLOBAL
# ------------------------------------------------------------------------------
total_checkpoints = (
    len(required_logos) + 
    total_versiones * 2 + # 2 encuestas por versión
    pth_docs_totales + 
    len(pdf_files_in_dist)
)

total_failures = (
    (0 if logos_all_ok else 1) + 
    audit_report["continuidad"]["encuestas_estudiantes"]["fallos"] + 
    audit_report["continuidad"]["encuestas_organizaciones"]["fallos"] + 
    pth_docs_fallidos + 
    dist_pdf_errors + 
    len(audit_report["urls_y_rutas"]["errores"])
)

audit_report["urls_y_rutas"]["total_referencias_dist"] = total_checkpoints
audit_report["urls_y_rutas"]["rutas_validas"] = total_checkpoints - total_failures
audit_report["urls_y_rutas"]["rutas_invalidas"] = total_failures

tasa_error = (total_failures / total_checkpoints) * 100 if total_checkpoints > 0 else 0.0
audit_report["tasa_error_global"] = tasa_error

print("\n" + "="*80)
print(f"RESULTADO FINAL DE LA AUDITORÍA DE CALIDAD:")
print(f"  Total Puntos de Control Auditados: {total_checkpoints}")
print(f"  Total Fallos Detectados: {total_failures}")
print(f"  TASA DE ERROR GLOBAL: {tasa_error:.4f}%")
print("="*80)

# Guardar informe raw en disco
with open("scripts/auditoria_calidad_final_dist.json", "w", encoding="utf-8") as f:
    json.dump(audit_report, f, indent=2, ensure_ascii=False)

print("\nInforme detallado guardado en scripts/auditoria_calidad_final_dist.json")
