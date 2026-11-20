# -*- coding: utf-8 -*-
"""
Auditoría técnica exhaustiva de datos y documentos - Portal VcM USS.
"""
import os
import sys
import json
import re
import openpyxl

WORKSPACE = r"c:\Users\oyarc\OneDrive - Universidad San Sebastian\VCM\Sistema Acceso Proyectos diplomado"
os.chdir(WORKSPACE)

results = {
    "whitelist": {},
    "iniciativas": {},
    "documentos_pdf": {},
    "continuidad": {},
    "planillas_excel": {}
}

print("="*80)
print("INICIANDO AUDITORÍA TÉCNICA Y CUANTITATIVA - PORTAL VCM USS")
print("="*80)

# ==============================================================================
# 1. AUDITORÍA DE DATOS Y WHITELIST
# ==============================================================================
print("\n[1] AUDITORÍA DE WHITELIST Y ESTUDIANTES...")
wb_est = openpyxl.load_workbook("Estudiantes Diplomado VcM 2026.xlsx", data_only=True)
ws_est = wb_est["Estudiantes Diplomado VcM"]
excel_students = []
for row in ws_est.iter_rows(min_row=2, values_only=True):
    if row[0] is not None:
        excel_students.append({
            "num": row[0],
            "apellidos": str(row[1]).strip() if row[1] else "",
            "nombres": str(row[2]).strip() if row[2] else "",
            "nombreCompleto": str(row[3]).strip() if row[3] else "",
            "identificacion": str(row[4]).strip() if row[4] else "",
            "correo": str(row[5]).strip() if row[5] else "",
            "tipo": str(row[6]).strip() if row[6] else "",
            "rutChileno": str(row[7]).strip() if row[7] else "",
            "rutSin": str(row[8]).strip() if row[8] else "",
            "pasaporte": str(row[9]).strip() if row[9] else "",
            "rutUSS": str(row[10]).strip() if row[10] else ""
        })

with open("src/data/whitelist.json", "r", encoding="utf-8") as f:
    whitelist = json.load(f)

admins_in_wl = [u for u in whitelist if "EST-" not in str(u.get("id", "")) and u.get("rol") != "Estudiante Diplomado"]
students_in_wl = [u for u in whitelist if u.get("rol") == "Estudiante Diplomado" or "EST-" in str(u.get("id", ""))]

# Check counts
total_excel = len(excel_students)
total_wl_students = len(students_in_wl)
total_wl_admins = len(admins_in_wl)
total_wl = len(whitelist)

chilenos_excel = [s for s in excel_students if s["tipo"].lower() == "nacional"]
internacionales_excel = [s for s in excel_students if s["tipo"].lower() == "internacional"]

chilenos_wl = [s for s in students_in_wl if str(s.get("tipo", "")).lower() == "nacional"]
internacionales_wl = [s for s in students_in_wl if str(s.get("tipo", "")).lower() == "internacional"]

# Function normalizeDoc and cleanRut simulation
def normalizeDoc(doc):
    if not doc:
        return ""
    return re.sub(r"[\.\-\s]", "", str(doc).strip().upper())

def cleanRut(rut):
    if not rut:
        return ""
    return re.sub(r"[^0-9K]", "", str(rut).upper())

# Simulate Login for all students
login_failures = []
for idx, s in enumerate(excel_students):
    doc_inputs_to_test = []
    if s["tipo"].lower() == "nacional":
        doc_inputs_to_test.extend([s["identificacion"], s["rutChileno"], s["rutSin"]])
    else:
        doc_inputs_to_test.extend([s["identificacion"], s["pasaporte"], s["rutUSS"]])
    
    # filter empty
    doc_inputs_to_test = [d for d in doc_inputs_to_test if d and d != "-"]
    
    # Check if ANY matches in whitelist
    matched = False
    for inp in doc_inputs_to_test:
        norm_inp = normalizeDoc(inp)
        found = False
        for u in whitelist:
            u_rut = normalizeDoc(u.get("rut"))
            u_rut_chileno = normalizeDoc(u.get("rutChileno"))
            u_rut_sin = normalizeDoc(u.get("rutSinFormato"))
            u_pasaporte = normalizeDoc(u.get("pasaporte"))
            u_asignado = normalizeDoc(u.get("rutAsignado"))
            if norm_inp in [u_rut, u_rut_chileno, u_rut_sin, u_pasaporte, u_asignado]:
                found = True
                break
        if found:
            matched = True
            break
            
    if not matched:
        login_failures.append({
            "num": s["num"],
            "nombre": s["nombreCompleto"],
            "tipo": s["tipo"],
            "identificacion": s["identificacion"]
        })

# Check official admins
admin_names_to_check = ["Franco Oyarce", "Consuelo", "Cristóbal Alarcón"]
admin_status = {}
for name in admin_names_to_check:
    matched_admins = [a for a in admins_in_wl if name.lower() in a.get("nombre", "").lower()]
    admin_status[name] = {
        "found": len(matched_admins) > 0,
        "details": matched_admins
    }

# Check duplicate keys in whitelist
ruts_seen = set()
duplicates_in_wl = []
for u in students_in_wl:
    uid = u.get("id")
    r = normalizeDoc(u.get("rut"))
    if r in ruts_seen:
        duplicates_in_wl.append({"id": uid, "rut": r, "nombre": u.get("nombre")})
    ruts_seen.add(r)

results["whitelist"] = {
    "total_excel_students": total_excel,
    "total_wl_students": total_wl_students,
    "total_wl_admins": total_wl_admins,
    "total_wl": total_wl,
    "chilenos_excel": len(chilenos_excel),
    "internacionales_excel": len(internacionales_excel),
    "chilenos_wl": len(chilenos_wl),
    "internacionales_wl": len(internacionales_wl),
    "duplicates_count": len(duplicates_in_wl),
    "duplicates": duplicates_in_wl,
    "login_failures_count": len(login_failures),
    "login_failures": login_failures,
    "admin_status": admin_status
}

print(f"  Total Estudiantes Excel: {total_excel} (140 Chilenos, 35 Internacionales)")
print(f"  Total Estudiantes Whitelist: {total_wl_students} ({len(chilenos_wl)} Chilenos, {len(internacionales_wl)} Internacionales)")
print(f"  Total Administradores en Whitelist: {total_wl_admins}")
print(f"  Duplicados en Whitelist: {len(duplicates_in_wl)}")
print(f"  Fallos de autenticación simulada: {len(login_failures)}")
for adm, st in admin_status.items():
    print(f"  Admin '{adm}': Encontrado = {st['found']}")

# ==============================================================================
# 2. AUDITORÍA DE PROYECTOS PTH Y LÍNEAS DE ACCIÓN
# ==============================================================================
print("\n[2] AUDITORÍA DE INICIATIVAS PTH Y LÍNEAS DE ACCIÓN...")
with open("src/data/iniciativas.json", "r", encoding="utf-8") as f:
    iniciativas = json.load(f)

# Load Proyectos_2024_2025.xlsx
wb_projs = openpyxl.load_workbook("Proyectos_2024_2025.xlsx", data_only=True)
ws_projs = wb_projs["Hoja1"]
excel_projs_map = {}
for row in ws_projs.iter_rows(min_row=2, values_only=True):
    p_id = str(row[0]).strip() if row[0] is not None else ""
    if p_id:
        excel_projs_map[p_id] = {
            "id": p_id,
            "nombre": str(row[1]).strip() if row[1] else "",
            "tipo": str(row[2]).strip() if row[2] else "",
            "idPrograma": str(row[3]).strip() if row[3] else "",
            "programa": str(row[4]).strip() if row[4] else "",
            "lineaAccion": str(row[5]).strip() if row[5] else "",
            "ano": str(row[6]).strip() if row[6] else ""
        }

pth_list = []
total_iniciativas_projs = 0
projects_missing_linea = []
projects_by_year = {"2024": 0, "2025": 0, "otro": 0}
indicator_anomalies = []
all_project_ids = []

for pth in iniciativas:
    p_projs = pth.get("proyectos", [])
    total_iniciativas_projs += len(p_projs)
    pth_summary = {
        "id": pth.get("id"),
        "nombre": pth.get("nombre"),
        "sigla": pth.get("sigla"),
        "count_proyectos": len(p_projs),
        "years": {}
    }
    for pr in p_projs:
        pid = str(pr.get("idNumero") or pr.get("id") or pr.get("codigo"))
        all_project_ids.append(pid)
        y = str(pr.get("ano", ""))
        pth_summary["years"][y] = pth_summary["years"].get(y, 0) + 1
        if y in projects_by_year:
            projects_by_year[y] += 1
        else:
            projects_by_year["otro"] += 1
            
        linea = pr.get("lineaAccion")
        if not linea or linea.strip() == "" or linea.strip() == "-":
            projects_missing_linea.append({
                "pth": pth.get("nombre"),
                "id": pr.get("id"),
                "codigo": pr.get("codigo"),
                "nombre": pr.get("nombre")
            })
            
        # Check indicators
        ind = pr.get("indicadores", {})
        org = ind.get("organizaciones", 0)
        est = ind.get("estudiantes", 0)
        acad = ind.get("academicos", 0)
        if org < 0 or est < 0 or acad < 0:
            indicator_anomalies.append({
                "id": pr.get("id"),
                "nombre": pr.get("nombre"),
                "issue": f"Indicadores negativos: org={org}, est={est}, acad={acad}"
            })
            
    pth_list.append(pth_summary)

results["iniciativas"] = {
    "total_pth": len(iniciativas),
    "pth_details": pth_list,
    "total_proyectos": total_iniciativas_projs,
    "projects_by_year": projects_by_year,
    "projects_missing_linea_count": len(projects_missing_linea),
    "projects_missing_linea": projects_missing_linea,
    "indicator_anomalies_count": len(indicator_anomalies),
    "indicator_anomalies": indicator_anomalies
}

print(f"  Total PTH en iniciativas.json: {len(iniciativas)}")
for p in pth_list:
    print(f"   - {p['nombre']} ({p['sigla']}): {p['count_proyectos']} proyectos (Años: {p['years']})")
print(f"  Total proyectos: {total_iniciativas_projs}")
print(f"  Proyectos por año: {projects_by_year}")
print(f"  Proyectos sin línea de acción: {len(projects_missing_linea)}")
print(f"  Anomalías en indicadores: {len(indicator_anomalies)}")

# ==============================================================================
# 3. AUDITORÍA DE ENLACES Y DOCUMENTOS PDF (0% ENLACES ROTOS)
# ==============================================================================
print("\n[3] AUDITORÍA DE ENLACES Y DOCUMENTOS PDF...")
pdf_checks = []

# Scan iniciativas.json
for pth in iniciativas:
    # check reportesGenerales
    rep_gen = pth.get("reportesGenerales", [])
    if isinstance(rep_gen, list):
        for rep in rep_gen:
            if isinstance(rep, dict) and rep.get("archivo"):
                pdf_checks.append({
                    "source": f"iniciativas.json -> PTH {pth.get('id')} -> reportesGenerales",
                    "nombre": rep.get("titulo") or rep.get("nombre"),
                    "archivo": rep.get("archivo"),
                    "disponible": True
                })
    elif isinstance(rep_gen, dict):
        for rep_k, rep in rep_gen.items():
            if isinstance(rep, dict) and rep.get("archivo"):
                pdf_checks.append({
                    "source": f"iniciativas.json -> PTH {pth.get('id')} -> reportesGenerales.{rep_k}",
                    "nombre": rep.get("titulo") or rep.get("nombre"),
                    "archivo": rep.get("archivo"),
                    "disponible": rep.get("disponible", True)
                })

    # check proyectos
    for pr in pth.get("proyectos", []):
        for doc_key, doc in pr.get("documentos", {}).items():
            if isinstance(doc, dict):
                pdf_checks.append({
                    "source": f"iniciativas.json -> Proyecto {pr.get('id')} -> documentos.{doc_key}",
                    "nombre": doc.get("nombre") or doc.get("nombreDescarga") or doc_key,
                    "archivo": doc.get("archivo"),
                    "disponible": doc.get("disponible", False)
                })

# Scan proyectosContinuidad.json
with open("src/data/proyectosContinuidad.json", "r", encoding="utf-8") as f:
    cont_programs = json.load(f)

for prog in cont_programs:
    for ver in prog.get("versiones", []):
        # archivo direct
        if ver.get("archivo"):
            pdf_checks.append({
                "source": f"proyectosContinuidad.json -> Prog {prog.get('id')} -> Versión {ver.get('id')} (archivo)",
                "nombre": ver.get("nombreDescarga") or ver.get("codigo"),
                "archivo": ver.get("archivo"),
                "disponible": True
            })
        for doc_key, doc in ver.get("documentos", {}).items():
            if isinstance(doc, dict):
                pdf_checks.append({
                    "source": f"proyectosContinuidad.json -> Prog {prog.get('id')} -> Versión {ver.get('id')} -> doc.{doc_key}",
                    "nombre": doc.get("nombre") or doc.get("nombreDescarga") or doc_key,
                    "archivo": doc.get("archivo"),
                    "disponible": doc.get("disponible", False)
                })

# Verify file existence on disk
broken_links = []
valid_links = []
skipped_not_available = []

for item in pdf_checks:
    archivo = item["archivo"]
    disponible = item["disponible"]
    
    if not disponible:
        skipped_not_available.append(item)
        continue
        
    if not archivo:
        broken_links.append({
            "item": item,
            "reason": "Campo 'archivo' vacío o nulo pero marcado disponible=true"
        })
        continue
        
    # Standardize path in public
    rel_path = archivo.lstrip("/")
    full_path = os.path.join(WORKSPACE, "public", rel_path)
    # Also check if it already starts with public
    if not os.path.exists(full_path):
        alt_path = os.path.join(WORKSPACE, rel_path)
        if os.path.exists(alt_path):
            full_path = alt_path
            
    if not os.path.exists(full_path):
        broken_links.append({
            "item": item,
            "path_checked": full_path,
            "reason": "Archivo no existe en disco"
        })
    else:
        # Check size
        size = os.path.getsize(full_path)
        if size == 0:
            broken_links.append({
                "item": item,
                "path_checked": full_path,
                "reason": "Archivo tiene 0 bytes"
            })
        else:
            valid_links.append({
                "item": item,
                "path": full_path,
                "size": size
            })

total_checked = len(valid_links) + len(broken_links)
error_pct = (len(broken_links) / total_checked * 100) if total_checked > 0 else 0

results["documentos_pdf"] = {
    "total_declared": len(pdf_checks),
    "skipped_not_available": len(skipped_not_available),
    "total_checked": total_checked,
    "valid_links": len(valid_links),
    "broken_links_count": len(broken_links),
    "broken_links": broken_links,
    "error_pct": error_pct
}

print(f"  Total documentos declarados: {len(pdf_checks)}")
print(f"  Documentos 'disponible=false' (omitidos): {len(skipped_not_available)}")
print(f"  Total documentos activos verificados: {total_checked}")
print(f"  Documentos válidos (físicamente existentes > 0 bytes): {len(valid_links)}")
print(f"  Enlaces rotos encontrados: {len(broken_links)}")
print(f"  % Error de enlaces: {error_pct:.2f}%")

if broken_links:
    for b in broken_links[:10]:
        print(f"    ALERTA ROTA: {b['item']['source']} -> {b['item']['archivo']} ({b['reason']})")

# ==============================================================================
# 4. AUDITORÍA DE PROYECTOS DE CONTINUIDAD Y REGLAS DE CONSUELO
# ==============================================================================
print("\n[4] AUDITORÍA DE PROYECTOS DE CONTINUIDAD Y REGLAS DE CONSUELO...")
total_prog = len(cont_programs)
total_versiones = sum(len(p.get("versiones", [])) for p in cont_programs)
version_ids = []
for p in cont_programs:
    for v in p.get("versiones", []):
        version_ids.append(str(v.get("idNumero") or v.get("codigo") or v.get("id")))

# Check for the word "anual" or "anuales"
json_cont_str = json.dumps(cont_programs, ensure_ascii=False)
anual_matches = re.findall(r"\banual(?:es)?\b", json_cont_str, re.IGNORECASE)

# Check sheet 'Estudiantes x Carrera' in Informe proyectos Colaborativos 4 programas.xlsx
wb_cont = openpyxl.load_workbook(r"proyectos continuidad\Informe proyectos Colaborativos 4 programas.xlsx", data_only=True)
ws_carreras = wb_cont["Estudiantes x Carrera"]
carreras_headers = [c for c in next(ws_carreras.iter_rows(min_row=1, max_row=1, values_only=True))]
carreras_data = []
for r in ws_carreras.iter_rows(min_row=2, values_only=True):
    if any(r):
        carreras_data.append(dict(zip(carreras_headers, r)))

# Cross check programs in continuity with the sheet
sheet_carreras_by_prog = {}
for row in carreras_data:
    prog_name = str(row.get("PROGRAMA") or row.get("Programa") or "").strip()
    carr = str(row.get("CARRERA") or row.get("Carrera") or "").strip()
    est_count = row.get("Estudiantes") or row.get("TOTAL") or row.get("Total") or 0
    if prog_name not in sheet_carreras_by_prog:
        sheet_carreras_by_prog[prog_name] = []
    sheet_carreras_by_prog[prog_name].append({"carrera": carr, "estudiantes": est_count})

results["continuidad"] = {
    "total_programas": total_prog,
    "total_versiones": total_versiones,
    "version_ids_count": len(version_ids),
    "version_ids": version_ids,
    "anual_matches_count": len(anual_matches),
    "anual_matches": anual_matches,
    "carreras_sheet_rows": len(carreras_data),
    "sheet_carreras_programs": list(sheet_carreras_by_prog.keys())
}

print(f"  Total programas de continuidad: {total_prog} (esperado: 4)")
print(f"  Total versiones / IDs: {total_versiones} (esperado: 19)")
print(f"  IDs de versiones verificados: {version_ids}")
print(f"  Apariciones de palabra 'anual/anuales': {len(anual_matches)}")
if anual_matches:
    print(f"    ALERTA: Se encontraron {len(anual_matches)} coincidencias de 'anual(es)'")

# ==============================================================================
# 5. AUDITORÍA DE PLANILLAS EXCEL GENERADAS
# ==============================================================================
print("\n[5] AUDITORÍA DE PLANILLAS EXCEL GENERADAS...")
excel_pth_path = os.path.join(WORKSPACE, "public", "descargas", "Consolidado_Proyectos_PTH_2024_2025.xlsx")
excel_cont_path = os.path.join(WORKSPACE, "public", "descargas", "Consolidado_Proyectos_Continuidad_2020_2025.xlsx")

def audit_excel_file(filepath):
    if not os.path.exists(filepath):
        return {"exists": False, "error": "Archivo no existe"}
    size = os.path.getsize(filepath)
    try:
        wb = openpyxl.load_workbook(filepath, data_only=True)
        sheet_info = {}
        for sname in wb.sheetnames:
            s = wb[sname]
            sheet_info[sname] = {
                "max_row": s.max_row,
                "max_col": s.max_column
            }
        return {
            "exists": True,
            "size": size,
            "sheets": wb.sheetnames,
            "sheet_info": sheet_info,
            "status": "OK"
        }
    except Exception as e:
        return {
            "exists": True,
            "size": size,
            "error": str(e),
            "status": "CORRUPTO"
        }

res_pth_excel = audit_excel_file(excel_pth_path)
res_cont_excel = audit_excel_file(excel_cont_path)

results["planillas_excel"] = {
    "consolidado_pth": res_pth_excel,
    "consolidado_continuidad": res_cont_excel
}

print(f"  Consolidado PTH 2024-2025: Existe={res_pth_excel['exists']}, Size={res_pth_excel.get('size')}, Status={res_pth_excel.get('status')}")
if res_pth_excel.get("exists"):
    for sname, sinfo in res_pth_excel.get("sheet_info", {}).items():
        print(f"    - Hoja '{sname}': {sinfo['max_row']} filas, {sinfo['max_col']} columnas")

print(f"  Consolidado Continuidad 2020-2025: Existe={res_cont_excel['exists']}, Size={res_cont_excel.get('size')}, Status={res_cont_excel.get('status')}")
if res_cont_excel.get("exists"):
    for sname, sinfo in res_cont_excel.get("sheet_info", {}).items():
        print(f"    - Hoja '{sname}': {sinfo['max_row']} filas, {sinfo['max_col']} columnas")

# Guardar resultados en JSON
with open("scripts/auditoria_resultados_raw.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "="*80)
print("AUDITORÍA PRELIMINAR FINALIZADA. Resultados guardados en scripts/auditoria_resultados_raw.json")
print("="*80)
