import json

d = json.load(open('src/data/iniciativas.json', encoding='utf-8'))
for ini in d:
    print(f"\n=== {ini['nombre']} ({len(ini['proyectos'])} proyectos) ===")
    print("Reportes Generales PTH:", len(ini.get('reportesGenerales', [])))
    for rg in ini.get('reportesGenerales', []):
        print(f"  • {rg.get('titulo')}: {rg.get('archivo')}")
    
    org_disp = 0
    est_disp = 0
    for p in ini['proyectos']:
        est = p['documentos'].get('encuestaEstudiantes', {})
        org = p['documentos'].get('encuestaOrganizaciones', {})
        if est.get('disponible'): est_disp += 1
        if org.get('disponible'): org_disp += 1
    print(f"  Total Estudiantes disponible: {est_disp}/{len(ini['proyectos'])}")
    print(f"  Total Organizaciones disponible: {org_disp}/{len(ini['proyectos'])}")
