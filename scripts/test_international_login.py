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

internacionales = [u for u in whitelist if u.get("tipo") == "Internacional"]
print(f"Total estudiantes internacionales: {len(internacionales)}")

failures = []
for u in internacionales:
    inputs_to_test = []
    # Test 1: exact passport
    if u.get("pasaporte"):
        inputs_to_test.append(u.get("pasaporte"))
        # lowercase
        inputs_to_test.append(u.get("pasaporte").lower())
        # with spaces
        inputs_to_test.append(" " + u.get("pasaporte") + " ")
    # Test 2: rutAsignado
    if u.get("rutAsignado"):
        inputs_to_test.append(u.get("rutAsignado"))
        inputs_to_test.append(u.get("rutAsignado").lower())
    # Test 3: rut
    if u.get("rut"):
        inputs_to_test.append(u.get("rut"))

    for inp in inputs_to_test:
        found = find_user_in_whitelist(inp)
        if not found or found.get("id") != u.get("id"):
            failures.append((u.get("id"), u.get("nombre"), inp))

print(f"Total failures testing permutations for all 35 international students: {len(failures)}")
if failures:
    for fail in failures:
        print("Failure:", fail)
else:
    print("ÉXITO: Todos los 35 estudiantes internacionales son reconocidos en cualquier variante!")
