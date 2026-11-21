const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = 'proyectos continuidad/Informe proyectos Colaborativos 4 programas.xlsx';
const jsonPath = 'src/data/proyectosContinuidad.json';

const wb = XLSX.readFile(excelPath);
const sResumen = XLSX.utils.sheet_to_json(wb.Sheets['Resumen'], { header: 1 });
const sIndicadores = XLSX.utils.sheet_to_json(wb.Sheets['Indicadores Proyecto'], { header: 1 });
const sOrgs = XLSX.utils.sheet_to_json(wb.Sheets['BD Organizaciones'], { header: 1 });
const sComunas = XLSX.utils.sheet_to_json(wb.Sheets['BD Comunas'], { header: 1 });

const currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Mapa de resumen por programa
// Fila 4: CET, 5: Bomberos, 6: PAMUSS, 7: Adolescentes
const resumenMap = {
  'pc-garantias-salud-reinsercion': {
    nombreExcel: 'Garantías en Salud – CET Concepción',
    fila: sResumen[4]
  },
  'pc-mas-salud-bomberos': {
    nombreExcel: 'Más Salud para Bomberos',
    fila: sResumen[5]
  },
  'pc-programa-adulto-mayor': {
    nombreExcel: 'Programa Adulto Mayor',
    fila: sResumen[6]
  },
  'pc-afectividad-salud-adolescentes': {
    nombreExcel: 'Afectividad en adolescentes',
    fila: sResumen[7]
  }
};

// Indicadores por ID
const indicadoresById = {};
for (let i = 4; i < sIndicadores.length; i++) {
  const row = sIndicadores[i];
  if (!row || !row[2]) continue;
  const id = String(row[2]).trim();
  indicadoresById[id] = {
    programa: row[0],
    sede: row[1],
    id: id,
    ano: row[3],
    nombre: row[4],
    tipo: row[5],
    lider: row[6],
    carreraLider: row[7] || 'No informada',
    pth: row[8] || 'Sin PTH',
    organizaciones: Math.round(row[9] || 0),
    comunas: Math.round(row[10] || 0),
    carreras: Math.round(row[11] || 0),
    estudiantesRepetidos: Math.round(row[12] || 0),
    estudiantesUnicos: Math.round(row[13] || 0),
    academicos: Math.round(row[14] || 0)
  };
}

// Organizaciones por ID
const orgsById = {};
for (let i = 1; i < sOrgs.length; i++) {
  const row = sOrgs[i];
  if (!row || !row[1]) continue;
  const id = String(row[1]).trim();
  if (!orgsById[id]) orgsById[id] = [];
  orgsById[id].push({
    organizacion: row[4],
    nombreOriginal: row[5],
    rut: row[6]
  });
}

// Comunas por ID
const comunasById = {};
for (let i = 1; i < sComunas.length; i++) {
  const row = sComunas[i];
  if (!row || !row[1]) continue;
  const id = String(row[1]).trim();
  if (!comunasById[id]) comunasById[id] = [];
  if (!comunasById[id].includes(row[4])) comunasById[id].push(row[4]);
}

// Actualizar currentData
const updatedData = currentData.map(prog => {
  const meta = resumenMap[prog.id];
  const rFila = meta ? meta.fila : null;

  const totalesConsolidados = rFila ? {
    programaSede: rFila[1],
    ids: rFila[2],
    totalProyectos: Math.round(rFila[3] || 0),
    totalOrganizaciones: Math.round(rFila[4] || 0),
    totalComunas: Math.round(rFila[5] || 0),
    totalCarreras: Math.round(rFila[6] || 0),
    totalEstudiantesRepetidos: Math.round(rFila[7] || 0),
    totalEstudiantesUnicos: Math.round(rFila[8] || 0),
    totalAcademicosDistintos: Math.round(rFila[9] || 0),
    totalParticipacionesAcademicos: Math.round(rFila[10] || 0),
    pthAsociado: rFila[11] || 'Sin PTH'
  } : null;

  // Extraer lista única de organizaciones de este programa
  const allOrgs = [];
  const allComunas = [];

  const updatedVersiones = prog.versiones.map(ver => {
    const idNum = ver.idNumero || ver.codigo.replace(/\D/g, '');
    const ind = indicadoresById[idNum];
    const orgs = orgsById[idNum] || [];
    const comunas = comunasById[idNum] || [];

    orgs.forEach(o => {
      if (!allOrgs.some(item => item.organizacion === o.organizacion)) {
        allOrgs.push(o);
      }
    });

    comunas.forEach(c => {
      if (!allComunas.includes(c)) allComunas.push(c);
    });

    return {
      ...ver,
      indicadores: ind ? {
        organizaciones: ind.organizaciones,
        comunas: ind.comunas,
        carreras: ind.carreras,
        estudiantes: ind.estudiantesRepetidos,
        estudiantesUnicos: ind.estudiantesUnicos,
        academicos: ind.academicos,
        lider: ind.lider,
        carreraLider: ind.carreraLider,
        pth: ind.pth
      } : ver.indicadores,
      organizacionesParticipantes: orgs,
      comunasParticipantes: comunas
    };
  });

  return {
    ...prog,
    totalesConsolidados,
    organizacionesParticipantes: allOrgs,
    comunasParticipantes: allComunas,
    versiones: updatedVersiones
  };
});

fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2), 'utf8');
console.log('Successfully updated src/data/proyectosContinuidad.json with full indicators!');
