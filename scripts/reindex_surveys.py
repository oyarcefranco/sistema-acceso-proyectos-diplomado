import os
import json
import openpyxl

data_path = "src/data/iniciativas.json"
iniciativas = json.load(open(data_path, encoding="utf-8"))

general_surveys = {
    "pth-mas-personas-mayores": {
        2024: {
            "estudiantes": "documentos/pth/pth-mas-personas-mayores/reportes-generales/PTH_Más_personas_mayores_activas_encuesta_estudiantes_2024.pdf"
        },
        2025: {
            "estudiantes": "documentos/pth/pth-mas-personas-mayores/reportes-generales/PTH_Más_personas_mayores_activas_encuesta_estudiantes_2025.pdf"
        }
    },
    "pth-mas-azul": {
        2024: {
            "estudiantes": "documentos/pth/pth-mas-azul/reportes-generales/PTH_Más_azul_estudiantes_2024_1.pdf",
            "organizaciones": "documentos/pth/pth-mas-azul/reportes-generales/PTH_Más_azul_Encuesta_organizaciones_2024.pdf"
        },
        2025: {
            "estudiantes": "documentos/pth/pth-mas-azul/reportes-generales/PTH_Más_azul_encuesta_estudiantes_2025_1.pdf",
            "organizaciones": "documentos/pth/pth-mas-azul/reportes-generales/PTH_Más_azul_Encuesta_organizaciones_2025.pdf"
        }
    },
    "pth-mas-parques": {
        2024: {
            "estudiantes": "documentos/pth/pth-mas-parques/reportes-generales/PTH_Más_parques_encuesta_estudiantes_2024_2.pdf",
            "organizaciones": "documentos/pth/pth-mas-parques/reportes-generales/PTH_Más_parques_Encuesta_organizaciones_2024_1.pdf"
        },
        2025: {
            "estudiantes": "documentos/pth/pth-mas-parques/reportes-generales/PTH_Más_parques_encuesta_estudiantes_2025_2.pdf",
            "organizaciones": "documentos/pth/pth-mas-parques/reportes-generales/PTH_Más_parques_Encuesta_organizaciones_2025_1.pdf"
        }
    }
}

updated_stats = {}

for ini in iniciativas:
    pth_id = ini["id"]
    pth_name = ini["nombre"]
    updated_stats[pth_name] = {"est_especifico": 0, "est_general": 0, "org_especifico": 0, "org_general": 0}

    for p in ini["proyectos"]:
        pid = p["idNumero"]
        ano = p["ano"]

        # 1. Encuesta Estudiantes
        specific_est_rel = f"documentos/pth/{pth_id}/encuestas-estudiantes/Encuesta_Estudiantes_ID_{pid}.pdf"
        specific_est_disk = f"public/{specific_est_rel}"

        if os.path.exists(specific_est_disk):
            sz_mb = f"{os.path.getsize(specific_est_disk) / 1024:.1f} KB"
            p["documentos"]["encuestaEstudiantes"] = {
                "disponible": True,
                "estado": "Validado",
                "esEspecifico": True,
                "tipoReporte": "Encuesta Específica",
                "archivo": specific_est_rel,
                "tamano": sz_mb,
                "nombreDescarga": f"Encuesta_Estudiantes_ID_{pid}_{ano}.pdf"
            }
            updated_stats[pth_name]["est_especifico"] += 1
        elif pth_id in general_surveys and ano in general_surveys[pth_id] and "estudiantes" in general_surveys[pth_id][ano]:
            gen_rel = general_surveys[pth_id][ano]["estudiantes"]
            gen_disk = f"public/{gen_rel}"
            sz_mb = f"{os.path.getsize(gen_disk) / (1024*1024):.1f} MB" if os.path.exists(gen_disk) else "1.2 MB"
            p["documentos"]["encuestaEstudiantes"] = {
                "disponible": True,
                "estado": "Reporte PTH",
                "esEspecifico": False,
                "tipoReporte": f"Reporte General PTH {ano}",
                "archivo": gen_rel,
                "tamano": sz_mb,
                "nombreDescarga": f"Reporte_General_Estudiantes_{pth_id}_{ano}.pdf"
            }
            updated_stats[pth_name]["est_general"] += 1
        else:
            p["documentos"]["encuestaEstudiantes"] = {
                "disponible": False,
                "estado": "No disponible",
                "esEspecifico": False,
                "tipoReporte": None,
                "archivo": None
            }

        # 2. Encuesta Organizaciones
        specific_org_rel = f"documentos/pth/{pth_id}/encuestas-organizaciones/Encuesta_Organizaciones_ID_{pid}.pdf"
        specific_org_disk = f"public/{specific_org_rel}"

        if os.path.exists(specific_org_disk):
            sz_mb = f"{os.path.getsize(specific_org_disk) / 1024:.1f} KB"
            p["documentos"]["encuestaOrganizaciones"] = {
                "disponible": True,
                "estado": "Validado",
                "esEspecifico": True,
                "tipoReporte": "Encuesta Específica",
                "archivo": specific_org_rel,
                "tamano": sz_mb,
                "nombreDescarga": f"Encuesta_Organizaciones_ID_{pid}_{ano}.pdf"
            }
            updated_stats[pth_name]["org_especifico"] += 1
        elif pth_id in general_surveys and ano in general_surveys[pth_id] and "organizaciones" in general_surveys[pth_id][ano]:
            gen_rel = general_surveys[pth_id][ano]["organizaciones"]
            gen_disk = f"public/{gen_rel}"
            sz_mb = f"{os.path.getsize(gen_disk) / 1024:.1f} KB" if os.path.exists(gen_disk) else "600 KB"
            p["documentos"]["encuestaOrganizaciones"] = {
                "disponible": True,
                "estado": "Reporte PTH",
                "esEspecifico": False,
                "tipoReporte": f"Reporte General PTH {ano}",
                "archivo": gen_rel,
                "tamano": sz_mb,
                "nombreDescarga": f"Reporte_General_Organizaciones_{pth_id}_{ano}.pdf"
            }
            updated_stats[pth_name]["org_general"] += 1
        else:
            p["documentos"]["encuestaOrganizaciones"] = {
                "disponible": False,
                "estado": "No disponible",
                "esEspecifico": False,
                "tipoReporte": None,
                "archivo": None
            }

# Guardar iniciativas.json
with open(data_path, "w", encoding="utf-8") as f:
    json.dump(iniciativas, f, indent=2, ensure_ascii=False)

print("=== RESULTADOS DE RE-INDEXACIÓN DE ENCUESTAS ===")
for pth_n, stats in updated_stats.items():
    print(f"{pth_n}:")
    print(f"  • Estudiantes: {stats['est_especifico']} específicas | {stats['est_general']} reporte general PTH")
    print(f"  • Organizaciones: {stats['org_especifico']} específicas | {stats['org_general']} reporte general PTH")
