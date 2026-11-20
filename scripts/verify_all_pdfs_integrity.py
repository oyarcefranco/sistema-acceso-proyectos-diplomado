import os
import json
import fitz # PyMuPDF

WORKSPACE = r"c:\Users\oyarc\OneDrive - Universidad San Sebastian\VCM\Sistema Acceso Proyectos diplomado"
os.chdir(WORKSPACE)

with open("src/data/iniciativas.json", "r", encoding="utf-8") as f:
    iniciativas = json.load(f)

with open("src/data/proyectosContinuidad.json", "r", encoding="utf-8") as f:
    continuidad = json.load(f)

active_pdfs = []

# 1. Reportes generales PTH
for pth in iniciativas:
    rep_gen = pth.get("reportesGenerales", [])
    if isinstance(rep_gen, list):
        for rep in rep_gen:
            if rep.get("archivo"):
                active_pdfs.append({
                    "origen": f"PTH {pth.get('sigla')} -> Reporte General",
                    "archivo": rep.get("archivo"),
                    "titulo": rep.get("titulo")
                })
    # Proyectos PTH
    for pr in pth.get("proyectos", []):
        for doc_k, doc in pr.get("documentos", {}).items():
            if isinstance(doc, dict) and doc.get("disponible") and doc.get("archivo"):
                active_pdfs.append({
                    "origen": f"PTH {pth.get('sigla')} -> Proyecto {pr.get('idNumero')} -> {doc_k}",
                    "archivo": doc.get("archivo"),
                    "titulo": doc.get("nombreDescarga") or doc_k
                })

# 2. Proyectos Continuidad
for prog in continuidad:
    for ver in prog.get("versiones", []):
        if ver.get("archivo"):
            active_pdfs.append({
                "origen": f"Continuidad {prog.get('id')} -> Versión {ver.get('idNumero')} -> archivo principal",
                "archivo": ver.get("archivo"),
                "titulo": ver.get("nombreDescarga")
            })
        for doc_k, doc in ver.get("documentos", {}).items():
            if isinstance(doc, dict) and doc.get("disponible") and doc.get("archivo"):
                active_pdfs.append({
                    "origen": f"Continuidad {prog.get('id')} -> Versión {ver.get('idNumero')} -> {doc_k}",
                    "archivo": doc.get("archivo"),
                    "titulo": doc.get("nombreDescarga") or doc_k
                })

print(f"Total PDFs activos a verificar: {len(active_pdfs)}")

corrupt_or_missing = []
total_pages = 0
total_bytes = 0

for item in active_pdfs:
    rel_path = item["archivo"].lstrip("/")
    full_path = os.path.join(WORKSPACE, "public", rel_path)
    if not os.path.exists(full_path):
        alt_path = os.path.join(WORKSPACE, rel_path)
        if os.path.exists(alt_path):
            full_path = alt_path

    if not os.path.exists(full_path):
        corrupt_or_missing.append({
            "item": item,
            "error": "No existe en disco",
            "path": full_path
        })
        continue

    size = os.path.getsize(full_path)
    if size == 0:
        corrupt_or_missing.append({
            "item": item,
            "error": "0 bytes",
            "path": full_path
        })
        continue

    total_bytes += size

    # PyMuPDF integrity check
    try:
        doc = fitz.open(full_path)
        page_count = len(doc)
        total_pages += page_count
        doc.close()
        if page_count == 0:
            corrupt_or_missing.append({
                "item": item,
                "error": "0 páginas",
                "path": full_path
            })
    except Exception as e:
        corrupt_or_missing.append({
            "item": item,
            "error": f"Error abriendo PDF: {str(e)}",
            "path": full_path
        })

print(f"\nResultados verificación de integridad física:")
print(f"  Total documentos analizados: {len(active_pdfs)}")
print(f"  Documentos 100% íntegros y legibles: {len(active_pdfs) - len(corrupt_or_missing)}")
print(f"  Documentos dañados o no encontrados: {len(corrupt_or_missing)}")
print(f"  Total de páginas PDF verificadas: {total_pages:,}")
print(f"  Volumen total de datos verificados: {total_bytes / (1024*1024):.2f} MB")
print(f"  Tasa de error / enlaces rotos: {len(corrupt_or_missing) / len(active_pdfs) * 100:.2f}%")

if corrupt_or_missing:
    for cm in corrupt_or_missing:
        print("  FALLO:", cm)
