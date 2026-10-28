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
  CheckCircle2
} from 'lucide-react';
import ProjectsTable from './ProjectsTable';
import DocumentListView from './DocumentListView';
import IndicatorsReportView from './IndicatorsReportView';
import JSZip from 'jszip';

export default function InitiativeDetail({ pth, onBack, onOpenDocument }) {
  const [activeTab, setActiveTab] = useState('matriz'); // 'matriz', 'estudiantes', 'organizaciones', 'cierre', 'indicadores'
  const [isZipping, setIsZipping] = useState(false);

  // Descarga del consolidado en Excel (CSV)
  const handleDownloadExcel = () => {
    let csv = '\uFEFF'; // BOM para que Excel abra UTF-8 con acentos correctamente en Windows
    csv += 'Iniciativa,Código,Año,Sede,Línea de Acción,Proyecto,N° Organizaciones,N° Estudiantes,N° Académicos,Encuesta Estudiantes,Encuesta Organizaciones,Informe Cierre\n';

    pth.proyectos.forEach((p) => {
      const docEst = p.documentos.encuestaEstudiantes.disponible ? 'Validado' : p.documentos.encuestaEstudiantes.estado;
      const docOrg = p.documentos.encuestaOrganizaciones.disponible ? 'Validado' : p.documentos.encuestaOrganizaciones.estado;
      const docCie = p.documentos.informeCierre.disponible ? 'Finalizado' : p.documentos.informeCierre.estado;
      csv += `"${pth.nombre}","${p.codigo}",${p.ano},"${p.sede}","${p.lineaAccion}","${p.nombre}",${p.indicadores.organizaciones},${p.indicadores.estudiantes},${p.indicadores.academicos},"${docEst}","${docOrg}","${docCie}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Listado_Proyectos_${pth.sigla}_2024_2025.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Descarga del expediente completo en un único archivo ZIP (Solución anti-OneDrive)
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `Expediente_${pth.sigla}_2024_2025`;
      const rootFolder = zip.folder(folderName);

      // 1. Agregar Planilla Excel/CSV consolidada
      let csv = '\uFEFF';
      csv += 'Iniciativa,Código,Año,Sede,Línea de Acción,Proyecto,N° Organizaciones,N° Estudiantes,N° Académicos\n';
      pth.proyectos.forEach((p) => {
        csv += `"${pth.nombre}","${p.codigo}",${p.ano},"${p.sede}","${p.lineaAccion}","${p.nombre}",${p.indicadores.organizaciones},${p.indicadores.estudiantes},${p.indicadores.academicos}\n`;
      });
      rootFolder.file('00_Listado_Consolidado_Proyectos_e_Indicadores.csv', csv);

      // 2. Crear carpetas ordenadas
      const fEstudiantes = rootFolder.folder('01_Encuestas_Estudiantes_Validadas');
      const fOrganizaciones = rootFolder.folder('02_Encuestas_Organizaciones_Validadas');
      const fCierres = rootFolder.folder('03_Informes_de_Cierre');

      pth.proyectos.forEach((p) => {
        if (p.documentos.encuestaEstudiantes.disponible) {
          fEstudiantes.file(
            `${p.codigo}_Reporte_Validado_Estudiantes_${p.ano}.txt`,
            `REPORTE VALIDADO DE ENCUESTA A ESTUDIANTES\nProyecto: [${p.codigo}] ${p.nombre}\nLínea: ${p.lineaAccion}\nAño: ${p.ano} - Sede: ${p.sede}\nEstudiantes participantes: ${p.indicadores.estudiantes}\nValidado por Dirección General de VcM USS.`
          );
        }
        if (p.documentos.encuestaOrganizaciones.disponible) {
          fOrganizaciones.file(
            `${p.codigo}_Reporte_Validado_Organizaciones_${p.ano}.txt`,
            `REPORTE VALIDADO DE ENCUESTA A ORGANIZACIONES EXTERNAS\nProyecto: [${p.codigo}] ${p.nombre}\nLínea: ${p.lineaAccion}\nAño: ${p.ano} - Sede: ${p.sede}\nOrganizaciones participantes: ${p.indicadores.organizaciones}\nValidado por Dirección General de VcM USS.`
          );
        }
        if (p.documentos.informeCierre.disponible) {
          fCierres.file(
            `${p.codigo}_Informe_Cierre_${p.ano}.txt`,
            `INFORME DE CIERRE OFICIAL\nProyecto: [${p.codigo}] ${p.nombre}\nLínea: ${p.lineaAccion}\nAño: ${p.ano} - Sede: ${p.sede}\nValidado por Dirección General de VcM USS.`
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

      {/* Cabecera Principal de la Iniciativa */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${pth.color.badge}`}>
                {pth.sigla}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Programa Territorial Hito
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pth.nombre}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pth.descripcion}
            </p>

            {/* Líneas de Acción */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">Líneas de Acción:</span>
              {pth.lineasDeAccion.map((linea) => (
                <span
                  key={linea}
                  className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200/60"
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
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
              title="Descargar listado en Excel de proyectos 2024 y 2025 distinguiendo línea de acción"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Descargar Planilla Proyectos (Excel)</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-uss-navy hover:bg-uss-blue text-white font-semibold text-xs transition shadow-sm cursor-pointer disabled:opacity-70"
              title="Descargar todos los reportes y documentos del PTH en un solo archivo comprimido"
            >
              <Archive className="w-4 h-4 text-sky-300" />
              <span>{isZipping ? 'Generando ZIP...' : 'Descargar Expediente (ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Globales (Reporte Cristóbal) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-100 pt-6">
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Total Proyectos</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {pth.totales.proyectos}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              {proyectos2024} en 2024 · {proyectos2025} en 2025
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Organizaciones</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
              {pth.totales.organizaciones}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Públicas y de la sociedad civil
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Estudiantes USS</span>
              <GraduationCap className="w-4 h-4 text-uss-blue" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-uss-blue">
              {pth.totales.estudiantes}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Participantes en iniciativas
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Académicos USS</span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600">
              {pth.totales.academicos}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Docentes guías y líderes
            </div>
          </div>
        </div>
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

        <button
          onClick={() => setActiveTab('estudiantes')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'estudiantes'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
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
          <Building2 className="w-4 h-4" />
          <span>Enc. Organizaciones</span>
        </button>

        <button
          onClick={() => setActiveTab('cierre')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'cierre'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Informes Cierre</span>
        </button>

        <button
          onClick={() => setActiveTab('indicadores')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0 ${
            activeTab === 'indicadores'
              ? 'bg-uss-navy text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Indicadores Cristóbal</span>
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div>
        {activeTab === 'matriz' && (
          <ProjectsTable pth={pth} onOpenDocument={onOpenDocument} />
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

        {activeTab === 'cierre' && (
          <DocumentListView
            pth={pth}
            docTypeKey="informeCierre"
            title="Informe de Cierre de Proyecto"
            docLabel="Informe de Cierre"
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
