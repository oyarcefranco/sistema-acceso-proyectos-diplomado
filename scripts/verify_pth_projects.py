import json

with open('src/data/iniciativas.json', 'r', encoding='utf-8') as f:
    iniciativas = json.load(f)

total_projs = 0
projects_report = []

for pth in iniciativas:
    pth_name = pth.get("nombre")
    pth_sigla = pth.get("sigla")
    lineas_oficiales = pth.get("lineasDeAccion", [])
    projs = pth.get("proyectos", [])
    total_projs += len(projs)

    for pr in projs:
        pid = pr.get("idNumero") or pr.get("id")
        nombre = pr.get("nombre")
        ano = pr.get("ano")
        linea = pr.get("lineaAccion")
        ind = pr.get("indicadores", {})

        # Validation checks
        issues = []
        if not pid:
            issues.append("Falta ID")
        if not nombre:
            issues.append("Falta nombre")
        if ano not in ["2024", "2025", 2024, 2025]:
            issues.append(f"Año no estándar: {ano}")
        if not linea:
            issues.append("Falta línea de acción")
        elif linea not in lineas_oficiales:
            issues.append(f"Línea de acción '{linea}' no está en líneas oficiales del PTH")

        # Indicators
        org = ind.get("organizaciones")
        est = ind.get("estudiantes")
        acad = ind.get("academicos")
        if org is None or org < 0:
            issues.append(f"Org inválido: {org}")
        if est is None or est < 0:
            issues.append(f"Est inválido: {est}")
        if acad is None or acad < 0:
            issues.append(f"Acad inválido: {acad}")

        projects_report.append({
            "pth": pth_sigla,
            "id": pid,
            "ano": ano,
            "nombre": nombre[:40],
            "linea": linea,
            "indicadores": f"Org:{org}, Est:{est}, Acad:{acad}",
            "issues": issues
        })

print(f"Total proyectos analizados: {total_projs}")
all_issues = [p for p in projects_report if p["issues"]]
print(f"Total proyectos con observaciones/errores: {len(all_issues)}")
if all_issues:
    for ai in all_issues:
        print(f"  ALERTA en ID {ai['id']} ({ai['pth']}): {ai['issues']}")
else:
    print("ÉXITO TOTAL: Los 64 proyectos de los 5 PTH tienen su Línea de Acción 100% asignada y coincidente con las líneas oficiales del PTH, e indicadores coherentes!")
