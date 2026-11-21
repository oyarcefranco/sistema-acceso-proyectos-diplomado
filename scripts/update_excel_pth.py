import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

iniciativas = json.load(open("src/data/iniciativas.json", encoding="utf-8"))

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Proyectos PTH 2024-2025"

# Encabezados
headers = [
    "PTH", "Sigla PTH", "ID Proyecto", "Código", "Año", "Sede", "Línea de Acción Oficial",
    "Nombre del Proyecto", "Tipo de Iniciativa", "Facultad", "Carrera Líder",
    "N° Organizaciones", "N° Estudiantes", "N° Académicos",
    "Formulario Postulación", "Informe Cierre", "Encuesta Estudiantes", "Encuesta Organizaciones"
]

ws.append(headers)

# Estilos de encabezado
header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
header_fill = PatternFill(start_color="002855", end_color="002855", fill_type="solid")
align_center = Alignment(horizontal="center", vertical="center")
align_left = Alignment(horizontal="left", vertical="center")
thin_border = Border(
    left=Side(style="thin", color="CCCCCC"),
    right=Side(style="thin", color="CCCCCC"),
    top=Side(style="thin", color="CCCCCC"),
    bottom=Side(style="thin", color="CCCCCC")
)

for col_num in range(1, len(headers) + 1):
    cell = ws.cell(row=1, column=col_num)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = align_center
    cell.border = thin_border

for ini in iniciativas:
    pth_nombre = ini["nombre"]
    pth_sigla = ini["sigla"]
    for p in ini["proyectos"]:
        doc_post = "Disponible" if p["documentos"]["formularioPostulacion"]["disponible"] else "No disponible"
        doc_cierre = "Finalizado" if p["documentos"]["informeCierre"]["disponible"] else "No disponible"
        
        est_meta = p["documentos"]["encuestaEstudiantes"]
        if est_meta["disponible"]:
            doc_est = "Específica" if est_meta.get("esEspecifico") else f"Reporte General PTH {p['ano']}"
        else:
            doc_est = "No disponible"

        org_meta = p["documentos"]["encuestaOrganizaciones"]
        if org_meta["disponible"]:
            doc_org = "Específica" if org_meta.get("esEspecifico") else f"Reporte General PTH {p['ano']}"
        else:
            doc_org = "No disponible"

        row = [
            pth_nombre,
            pth_sigla,
            p["idNumero"],
            p["codigo"],
            p["ano"],
            p["sede"],
            p["lineaAccion"],
            p["nombre"],
            p["tipo"],
            p.get("facultad", "USS"),
            p.get("carreraLider", "Multidisciplinar"),
            p["indicadores"]["organizaciones"],
            p["indicadores"]["estudiantes"],
            p["indicadores"]["academicos"],
            doc_post,
            doc_cierre,
            doc_est,
            doc_org
        ]
        ws.append(row)

for row in ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=1, max_col=len(headers)):
    for cell in row:
        cell.border = thin_border
        if cell.column in [3, 4, 5, 12, 13, 14]:
            cell.alignment = align_center
        else:
            cell.alignment = align_left

# Anchos automáticos
for col in ws.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = openpyxl.utils.get_column_letter(col[0].column)
    ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 45)

excel_path = "public/descargas/Consolidado_Proyectos_PTH_2024_2025.xlsx"
wb.save(excel_path)
print(f"Excel guardado exitosamente en {excel_path} con {ws.max_row - 1} proyectos.")
