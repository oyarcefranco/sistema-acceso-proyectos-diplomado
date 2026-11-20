import json
import re

with open('src/data/whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

def normalizeDoc(doc):
    if not doc:
        return ""
    return re.sub(r"[\.\-\s]", "", str(doc).strip().upper())

def find_user_in_whitelist(input_val):
    norm = normalizeDoc(input_val)
    for u in whitelist:
        u_rut = normalizeDoc(u.get("rut"))
        u_rut_chileno = normalizeDoc(u.get("rutChileno"))
        u_rut_sin = normalizeDoc(u.get("rutSinFormato"))
        u_pasaporte = normalizeDoc(u.get("pasaporte"))
        u_asignado = normalizeDoc(u.get("rutAsignado"))
        if norm in [u_rut, u_rut_chileno, u_rut_sin, u_pasaporte, u_asignado]:
            return u
    return None

chilenos = [u for u in whitelist if u.get("tipo") == "Nacional"]
print(f"Total estudiantes chilenos: {len(chilenos)}")

failures = []
for u in chilenos:
    rut_val = u.get("rutChileno") or u.get("rut")
    rut_sin = u.get("rutSinFormato")
    inputs_to_test = [
        rut_val,
        rut_val.lower(),
        rut_sin,
        rut_sin.lower() if rut_sin else "",
        "  " + rut_val + "  ",
        rut_val.replace(".", "")
    ]
    inputs_to_test = [i for i in inputs_to_test if i]

    for inp in inputs_to_test:
        found = find_user_in_whitelist(inp)
        if not found or found.get("id") != u.get("id"):
            failures.append((u.get("id"), u.get("nombre"), inp))

print(f"Total failures testing permutations for all 140 Chilean students: {len(failures)}")
if failures:
    for fail in failures[:10]:
        print("Failure:", fail)
else:
    print("ÉXITO: Todos los 140 estudiantes chilenos son reconocidos en cualquier variante de formato o minúsculas!")
