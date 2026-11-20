import json

with open('src/data/proyectosContinuidad.json', encoding='utf-8') as f:
    cont = json.load(f)

for p in cont:
    print('*** PROGRAMA:', p['nombre'], '***')
    print('Carreras globales:', p.get('carrerasParticipantes'))
    for v in p['versiones']:
        c_list = v.get('carreras', [])
        c_det = v.get('carrerasDetalle', [])
        print(f"  Versión {v.get('idNumero')} ({v.get('ano')}): {len(c_list)} carreras")
        if c_det:
            print(f"     Detalle: {c_det}")
