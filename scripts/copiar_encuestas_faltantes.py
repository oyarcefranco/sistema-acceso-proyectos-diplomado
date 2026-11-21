import os
import shutil
import json

# 1. Asegurar carpetas destino
os.makedirs("public/documentos/pth/pth-mas-parques/encuestas-organizaciones", exist_ok=True)
os.makedirs("public/documentos/pth/pth-mas-personas-mayores/encuestas-estudiantes", exist_ok=True)
os.makedirs("public/documentos/pth/pth-mas-personas-mayores/encuestas-organizaciones", exist_ok=True)

# 2. Copiar encuestas de organizaciones de Mas Parques
shutil.copy2(
    "Proyectos por PTH/Mas parques/Encuesta organizaciones por ID/ID 3527 1.pdf",
    "public/documentos/pth/pth-mas-parques/encuestas-organizaciones/Encuesta_Organizaciones_ID_3527.pdf"
)
shutil.copy2(
    "Proyectos por PTH/Mas parques/Encuesta organizaciones por ID/ID 4733 1.pdf",
    "public/documentos/pth/pth-mas-parques/encuestas-organizaciones/Encuesta_Organizaciones_ID_4733.pdf"
)
shutil.copy2(
    "Proyectos por PTH/Mas parques/Encuesta organizaciones por ID/ID 4925.pdf",
    "public/documentos/pth/pth-mas-parques/encuestas-organizaciones/Encuesta_Organizaciones_ID_4925.pdf"
)
shutil.copy2(
    "Proyectos por PTH/Mas parques/Encuesta organizaciones por ID/ID 4927.pdf",
    "public/documentos/pth/pth-mas-parques/encuestas-organizaciones/Encuesta_Organizaciones_ID_4927.pdf"
)
print("Copied 4 organizaciones surveys for Mas Parques.")

# 3. Copiar encuestas de ID 4406 para Mas Personas Mayores Activas
if os.path.exists("public/documentos/continuidad/ID_4406/Encuesta_Estudiantes_ID_4406.pdf"):
    shutil.copy2(
        "public/documentos/continuidad/ID_4406/Encuesta_Estudiantes_ID_4406.pdf",
        "public/documentos/pth/pth-mas-personas-mayores/encuestas-estudiantes/Encuesta_Estudiantes_ID_4406.pdf"
    )
if os.path.exists("public/documentos/continuidad/ID_4406/Encuesta_Organizaciones_ID_4406.pdf"):
    shutil.copy2(
        "public/documentos/continuidad/ID_4406/Encuesta_Organizaciones_ID_4406.pdf",
        "public/documentos/pth/pth-mas-personas-mayores/encuestas-organizaciones/Encuesta_Organizaciones_ID_4406.pdf"
    )
print("Copied ID 4406 surveys for Mas Personas Mayores Activas.")
