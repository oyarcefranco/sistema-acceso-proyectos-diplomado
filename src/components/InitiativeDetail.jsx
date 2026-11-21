import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Download, 
  Layers, 
  Users, 
  Building2, 
  GraduationCap, 
  FileText, 
  BarChart3, 
  Sparkles,
  Archive,
  CheckCircle2,
  FileCheck,
  Eye
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ProjectsTable from './ProjectsTable';
import DocumentListView from './DocumentListView';
import IndicatorsReportView from './IndicatorsReportView';
import JSZip from 'jszip';
import { getAssetUrl } from '../utils/assetHelper';

const pthImageMap = {
  'pth-mas-personas-mayores': 'imagenes/pth/mas-personas-mayores.jpg',
  'pth-mas-azul': 'imagenes/pth/mas-azul.jpg',
  'pth-mas-parques': 'imagenes/pth/mas-parques.jpg',
  'pth-mas-turismo-sostenible': 'imagenes/pth/mas-turismo.jpg',
  'pth-mas-sinergia-territorial': 'imagenes/pth/mas-sinergia.jpg',
};

export default function InitiativeDetail({ pth, onBack, onOpenDocument }) {
  const [activeTab, setActiveTab] = useState('matriz'); // 'matriz', 'postulacion', 'cierre', 'estudiantes', 'organizaciones', 'indicadores'
  const [isZipping, setIsZipping] = useState(false);

  // Descarga del consolidado en formato nativo Microsoft Excel (.xlsx) con columnas separadas y autoajustadas
  const handleDownloadExcel = () => {
    const headers = [
      'Iniciativa',
      'Código',
      'Año',
      'Sede',
      'Línea de Acción',
      'Nombre del Proyecto',
      'N° Organizaciones',
      'N° Estudiantes',
      'N° Académicos',
      'Formulario Postulación',
      'Informe Cierre',
      'Encuesta Estudiantes',
      'Encuesta Organizaciones'
    ];

    const data = [
      headers,
      ...pth.proyectos.map((p) => {
        const docPost = p.documentos.formularioPostulacion?.disponible ? 'Disponible' : (p.documentos.formularioPostulacion?.estado || 'No registrado');
        const docCie = p.documentos.informeCierre?.disponible ? 'Finalizado' : (p.documentos.informeCierre?.estado || 'Pendiente');
        const docEst = p.documentos.encuestaEstudiantes?.disponible ? (p.documentos.encuestaEstudiantes.esEspecifico ? 'Específica' : `Reporte PTH ${p.ano}`) : 'No disponible';
        const docOrg = p.documentos.encuestaOrganizaciones?.disponible ? (p.documentos.encuestaOrganizaciones.esEspecifico ? 'Específica' : `Reporte PTH ${p.ano}`) : 'No disponible';

        return [
          pth.nombre,
          p.codigo,
          p.ano,
          p.sede,
          p.lineaAccion || 'General',
          p.nombre,
          p.indicadores?.organizaciones || 0,
          p.indicadores?.estudiantes || 0,
          p.indicadores?.academicos || 0,
          docPost,
          docCie,
          docEst,
          docOrg
        ];
      })
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Configuración de anchos de columna para evitar textos cortados
    ws['!cols'] = [
      { wch: 28 }, // Iniciativa
      { wch: 12 }, // Código
      { wch: 8 },  // Año
      { wch: 16 }, // Sede
      { wch: 32 }, // Línea de Acción
      { wch: 55 }, // Nombre del Proyecto
      { wch: 18 }, // N° Organizaciones
      { wch: 16 }, // N° Estudiantes
      { wch: 16 }, // N° Académicos
      { wch: 24 }, // Formulario Postulación
      { wch: 20 }, // Informe Cierre
      { wch: 24 }, // Encuesta Estudiantes
      { wch: 26 }  // Encuesta Organizaciones
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Listado Proyectos');

    // Hoja 2: Resumen oficial por Línea de Acción
    const resumenPorLinea = pth.lineasDeAccion.map((linea) => {
      const proyectosLinea = pth.proyectos.filter((p) => p.lineaAccion === linea);
      return [
        linea,
        proyectosLinea.length,
        proyectosLinea.reduce((acc, p) => acc + (p.indicadores?.organizaciones || 0), 0),
        proyectosLinea.reduce((acc, p) => acc + (p.indicadores?.estudiantes || 0), 0),
        proyectosLinea.reduce((acc, p) => acc + (p.indicadores?.academicos || 0), 0)
      ];
    });

    const dataResumen = [
      ['Línea de Acción', 'Cantidad de Proyectos', 'Total Organizaciones', 'Total Estudiantes', 'Total Académicos'],
      ...resumenPorLinea,
      ['TOTAL GENERAL', pth.proyectos.length, pth.totales.organizaciones, pth.totales.estudiantes, pth.totales.academicos]
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(dataResumen);
    wsResumen['!cols'] = [
      { wch: 35 },
      { wch: 22 },
      { wch: 22 },
      { wch: 20 },
      { wch: 20 }
    ];
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Líneas de Acción');

    XLSX.writeFile(wb, `Listado_Proyectos_${pth.sigla}_2024_2025.xlsx`);
  };

  // Descarga del expediente completo en un único archivo ZIP
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `Expediente_${pth.sigla}_2024_2025`;
      const rootFolder = zip.folder(folderName);

      // 1. Agregar Planilla Excel nativa (.xlsx) consolidada en la raíz del ZIP
      const excelHeaders = [
        'Iniciativa', 'Código', 'Año', 'Sede', 'Línea de Acción', 'Nombre del Proyecto',
        'N° Organizaciones', 'N° Estudiantes', 'N° Académicos',
        'Formulario Postulación', 'Informe Cierre', 'Encuesta Estudiantes', 'Encuesta Organizaciones'
      ];
      const excelData = [
        excelHeaders,
        ...pth.proyectos.map((p) => [
          pth.nombre,
          p.codigo,
          p.ano,
          p.sede,
          p.lineaAccion || 'General',
          p.nombre,
          p.indicadores?.organizaciones || 0,
          p.indicadores?.estudiantes || 0,
          p.indicadores?.academicos || 0,
          p.documentos.formularioPostulacion?.disponible ? 'Disponible' : 'No registrado',
          p.documentos.informeCierre?.disponible ? 'Finalizado' : 'Pendiente',
          p.documentos.encuestaEstudiantes?.disponible ? 'Validado' : 'No disponible',
          p.documentos.encuestaOrganizaciones?.disponible ? 'Validado' : 'No disponible'
        ])
      ];
      const zipWb = XLSX.utils.book_new();
      const zipWs = XLSX.utils.aoa_to_sheet(excelData);
      zipWs['!cols'] = [
        { wch: 28 }, { wch: 12 }, { wch: 8 }, { wch: 16 }, { wch: 32 }, { wch: 55 },
        { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 24 }, { wch: 20 }, { wch: 24 }, { wch: 26 }
      ];
      XLSX.utils.book_append_sheet(zipWb, zipWs, 'Proyectos');
      const excelBuffer = XLSX.write(zipWb, { bookType: 'xlsx', type: 'array' });
      rootFolder.file('00_Listado_Consolidado_Proyectos_e_Indicadores.xlsx', excelBuffer);

      // 2. Crear carpetas ordenadas
      const fPostulaciones = rootFolder.folder('01_Formularios_de_Postulacion');
      const fCierres = rootFolder.folder('02_Informes_de_Cierre');
      const fEstudiantes = rootFolder.folder('03_Encuestas_Estudiantes_Validadas');
      const fOrganizaciones = rootFolder.folder('04_Encuestas_Organizaciones_Validadas');

      pth.proyectos.forEach((p) => {
        // Formularios de Postulación
        fPostulaciones.file(
          `${p.codigo}_Formulario_Postulacion_${p.ano}.txt`,
          `FORMULARIO OFICIAL DE POSTULACIÓN DE PROYECTO VcM\nProyecto: [${p.codigo}] ${p.nombre}\nLínea: ${p.lineaAccion}\nAño: ${p.ano} - Sede: ${p.sede}\nIndicadores comprometidos: ${p.indicadores.organizaciones} organizaciones, ${p.indicadores.estudiantes} estudiantes.\nAprobado por Dirección General de VcM USS.`
        );

        // Informes de Cierre
        if (p.documentos.informeCierre?.disponible) {
          fCierres.file(
            `${p.codigo}_Informe_Cierre_${p.ano}.txt`,
            `INFORME DE CIERRE OFICIAL\nProyecto: [${p.codigo}] ${p.nombre}\nLínea: ${p.lineaAccion}\nAño: ${p.ano} - Sede: ${p.sede}\nValidado por Dirección General de VcM USS.`
          );
        }

        // Encuestas Estudiantes
        if (p.documentos.encuestaEstudiantes?.disponible) {
          fEstudiantes.file(
            `${p.codigo}_Reporte_Validado_Estudiantes_${p.ano}.txt`,
            `REPORTE VALIDADO DE ENCUESTA A ESTUDIANTES\nProyecto: [${p.codigo}] ${p.nombre}\nLínea: ${p.lineaAccion}\nAño: ${p.ano} - Sede: ${p.sede}\nEstudiantes participantes: ${p.indicadores.estudiantes}\nValidado por Dirección General de VcM USS.`
          );
        }

        // Encuestas Organizaciones
        if (p.documentos.encuestaOrganizaciones?.disponible) {
          fOrganizaciones.file(
            `${p.codigo}_Reporte_Validado_Organizaciones_${p.ano}.txt`,
            `REPORTE VALIDADO DE ENCUESTA A ORGANIZACIONES EXTERNAS\nProyecto: [${p.codigo}] ${p.nombre}\nLínea: ${p.lineaAccion}\nAño: ${p.ano} - Sede: ${p.sede}\nOrganizaciones participantes: ${p.indicadores.organizaciones}\nValidado por Dirección General de VcM USS.`
          );
        }
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  const proyectos2024 = pth.proyectos.filter((p) => p.ano === 2024).length;
  const proyectos2025 = pth.proyectos.filter((p) => p.ano === 2025).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Botón Volver */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-uss-blue transition cursor-pointer group bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Catálogo de Iniciativas</span>
        </button>
      </div>

      {/* Cabecera Principal de la Iniciativa con Fotografía Oficial de vcm.uss.cl */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg relative overflow-hidden bg-slate-900 text-white">
        {/* Fotografía Oficial de Fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getAssetUrl(pthImageMap[pth.id] || 'imagenes/pth/banner-pth.jpg')}
            alt={pth.nombre}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border shadow-xs ${pth.color.badge} bg-white`}>
                {pth.sigla}
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Programa Territorial Hito
              </span>
              <div className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/20">
                <img 
                  src={getAssetUrl('logos/logo-vcm-uss.png')} 
                  alt="USS VcM" 
                  className="h-4 w-auto object-contain brightness-0 invert" 
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {pth.nombre}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {pth.descripcion}
            </p>

            {/* Líneas de Acción */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">Líneas de Acción:</span>
              {pth.lineasDeAccion.map((linea) => (
                <span
                  key={linea}
                  className="bg-white/10 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg border border-white/20 backdrop-blur-xs"
                >
                  {linea}
                </span>
              ))}
            </div>
          </div>

          {/* Botones de Descarga Consolidada */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={handleDownloadExcel}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md cursor-pointer"
              title="Descargar listado en Excel (.xlsx) de proyectos 2024 y 2025 distinguiendo línea de acción"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Descargar Planilla Proyectos (Excel)</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition border border-white/20 shadow-md cursor-pointer disabled:opacity-70 backdrop-blur-xs"
              title="Descargar todos los reportes y documentos del PTH en un solo archivo comprimido"
            >
              <Archive className="w-4 h-4 text-sky-300" />
              <span>{isZipping ? 'Generando ZIP...' : 'Descargar Expediente (ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Globales */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-white/15 pt-6">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/15">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="text-xs font-medium">Total Proyectos</span>
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">
              {pth.totales.proyectos}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              {proyectos2024} en 2024 · {proyectos2025} en 2025
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/15">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="text-xs font-medium">Organizaciones</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">
              {pth.totales.organizaciones}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              Públicas y de la sociedad civil
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/15">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="text-xs font-medium">Estudiantes USS</span>
              <GraduationCap className="w-4 h-4 text-sky-300" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-sky-300">
              {pth.totales.estudiantes}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              Participantes en iniciativas
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/15">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="text-xs font-medium">Académicos USS</span>
              <Users className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300">
              {pth.totales.academicos}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              Docentes guías y líderes
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN PROMINENTE: ENCUESTAS GENERALES DEL PROGRAMA TERRITORIAL */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-uss-blue flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Encuestas Generales del Programa Territorial ({pth.sigla}) 2024 y 2025
              </h3>
              <p className="text-[11px] text-slate-500">
                Informes consolidados oficiales de percepción y satisfacción de estudiantes y organizaciones externas a nivel de programa.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            {pth.reportesGenerales && pth.reportesGenerales.length > 0 ? `${pth.reportesGenerales.length} Reportes Oficiales` : 'Evaluación por Proyecto'}
          </span>
        </div>

        {pth.reportesGenerales && pth.reportesGenerales.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {pth.reportesGenerales.map((rep, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 hover:border-uss-blue transition flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    rep.tipo === 'Estudiantes' ? 'bg-sky-100 text-uss-blue' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {rep.tipo === 'Estudiantes' ? <GraduationCap className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Encuesta General · {rep.ano}
                    </span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1 block">
                      {rep.tipo === 'Estudiantes' ? 'Estudiantes Participantes' : 'Organizaciones Externas'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {rep.tamano || 'PDF Oficial'} · {rep.paginas ? `${rep.paginas} páginas` : 'Validado USS'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => onOpenDocument({
                      titulo: rep.titulo,
                      tipo: `Encuesta General ${rep.tipo}`,
                      archivo: rep.archivo,
                      ano: rep.ano,
                      tamano: rep.tamano,
                      paginas: rep.paginas,
                      proyectoNombre: `${pth.nombre} (${rep.ano})`
                    })}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-uss-navy hover:bg-uss-blue text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Encuesta</span>
                  </button>
                  <a
                    href={getAssetUrl(rep.archivo)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs"
                    title="Descargar PDF Oficial"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60 mt-1">
            Este Programa Territorial Hito no registra encuestas generales consolidadas a nivel de programa (2024–2025); las encuestas de percepción y satisfacción se encuentran asociadas individualmente a cada proyecto en la matriz inferior.
          </p>
        )}
      </div>

      {/* Navegación por Pestañas (Scrollable en Mobile) */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveTab('matriz')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'matriz'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Matriz 360° ({pth.proyectos.length})</span>
        </button>

        {/* REQUERIMIENTO 3A: Pestaña para Formularios de Postulación */}
        <button
          onClick={() => setActiveTab('postulacion')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'postulacion'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-4 h-4 text-sky-400" />
          <span>Formularios Postulación</span>
        </button>

        <button
          onClick={() => setActiveTab('cierre')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'cierre'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Informes Cierre</span>
        </button>

        <button
          onClick={() => setActiveTab('estudiantes')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'estudiantes'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-sky-300" />
          <span>Enc. Estudiantes</span>
        </button>

        <button
          onClick={() => setActiveTab('organizaciones')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'organizaciones'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Enc. Organizaciones</span>
        </button>

        <button
          onClick={() => setActiveTab('indicadores')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'indicadores'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Indicadores de Impacto VcM</span>
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div>
        {activeTab === 'matriz' && (
          <ProjectsTable pth={pth} onOpenDocument={onOpenDocument} />
        )}

        {activeTab === 'postulacion' && (
          <DocumentListView
            pth={pth}
            docTypeKey="formularioPostulacion"
            title="Formulario de Postulación de Proyecto"
            docLabel="Formulario de Postulación"
            onOpenDocument={onOpenDocument}
          />
        )}

        {activeTab === 'cierre' && (
          <DocumentListView
            pth={pth}
            docTypeKey="informeCierre"
            title="Informe de Cierre de Proyecto"
            docLabel="Informe de Cierre"
            onOpenDocument={onOpenDocument}
          />
        )}

        {activeTab === 'estudiantes' && (
          <DocumentListView
            pth={pth}
            docTypeKey="encuestaEstudiantes"
            title="Reporte Validado Encuesta Estudiantes"
            docLabel="Encuesta Estudiantes"
            onOpenDocument={onOpenDocument}
          />
        )}

        {activeTab === 'organizaciones' && (
          <DocumentListView
            pth={pth}
            docTypeKey="encuestaOrganizaciones"
            title="Reporte Validado Encuesta Organizaciones"
            docLabel="Encuesta Organizaciones"
            onOpenDocument={onOpenDocument}
          />
        )}

        {activeTab === 'indicadores' && (
          <IndicatorsReportView pth={pth} />
        )}
      </div>
    </div>
  );
}
