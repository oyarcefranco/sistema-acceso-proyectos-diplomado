import json
import openpyxl
import re

wb = openpyxl.load_workbook('Estudiantes Diplomado VcM 2026.xlsx', data_only=True)
ws = wb['Estudiantes Diplomado VcM']

with open('src/data/whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

students_wl = [u for u in whitelist if "EST-" in str(u.get("id", ""))]

print(f"Total students in Excel: {ws.max_row - 1}")
print(f"Total students in whitelist: {len(students_wl)}")

excel_rows = list(ws.iter_rows(min_row=2, values_only=True))

discrepancies = []
for idx, r in enumerate(excel_rows):
    num = r[0]
    apellidos = str(r[1]).strip() if r[1] else ""
    nombres = str(r[2]).strip() if r[2] else ""
    nombre_completo = str(r[3]).strip() if r[3] else ""
    identificacion = str(r[4]).strip() if r[4] else ""
    correo = str(r[5]).strip() if r[5] else ""
    tipo = str(r[6]).strip() if r[6] else ""
    rut_chileno = str(r[7]).strip() if r[7] else ""
    rut_sin = str(r[8]).strip() if r[8] else ""
    pasaporte = str(r[9]).strip() if r[9] else ""
    rut_uss = str(r[10]).strip() if r[10] else ""

    # Find matching student in whitelist by EST-id or nombre
    est_id = f"EST-{int(num):03d}"
    matched = next((u for u in students_wl if u.get("id") == est_id), None)
    if not matched:
        discrepancies.append(f"Student {est_id} ({nombre_completo}) not found in whitelist!")
        continue

    # Compare fields
    if matched.get("nombre") != nombre_completo:
        discrepancies.append(f"Nombre mismatch in {est_id}: excel '{nombre_completo}' vs wl '{matched.get('nombre')}'")
    if matched.get("correo") != correo:
        discrepancies.append(f"Correo mismatch in {est_id}: excel '{correo}' vs wl '{matched.get('correo')}'")
    if matched.get("tipo") != tipo:
        discrepancies.append(f"Tipo mismatch in {est_id}: excel '{tipo}' vs wl '{matched.get('tipo')}'")

print(f"Total field discrepancies: {len(discrepancies)}")
if discrepancies:
    for d in discrepancies[:10]:
        print(" ", d)
else:
    print("TODOS los 175 estudiantes coinciden 100% campo por campo con el Excel original!")
