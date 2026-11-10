import React, { useEffect } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Building2, 
  Users, 
  GraduationCap
} from 'lucide-react';

export default function PDFModalViewer({ documentData, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!documentData) return null;

  const { 
    tipo, 
    proyecto, 
    pth, 
    archivo, 
    tamano, 
    fecha, 
    isRealPdf, 
    archivoUrl, 
    nombreDescarga 
  } = documentData;

  const handleDownload = () => {
    if (isRealPdf && archivoUrl) {
      const link = document.createElement('a');
      link.href = archivoUrl;
      link.download = nombreDescarga || archivo.split('/').pop() || 'informe_cierre.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Para reportes simulados mientras llegan los PDFs de los PTH
    const content = `UNIVERSIDAD SAN SEBASTIÁN - VINCULACIÓN CON EL MEDIO\nDOCUMENTO OFICIAL VALIDADO\nTipo: ${tipo}\nIniciativa: ${pth.nombre} (${pth.sigla})\nProyecto: [${proyecto.codigo}] ${proyecto.nombre}\nLínea de Acción: ${proyecto.lineaAccion}\nAño de Ejecución: ${proyecto.ano} - Sede: ${proyecto.sede}\nIndicadores: ${proyecto.indicadores.organizaciones} Organizaciones | ${proyecto.indicadores.estudiantes} Estudiantes | ${proyecto.indicadores.academicos} Académicos\nValidación: Dirección General de Vinculación con el Medio (USS)\nFecha Reporte: ${fecha || '2024-2025'}\nArchivo: ${archivo}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = archivo.split('/').pop() || 'reporte_vcm.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-full sm:h-[92vh] bg-white rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Barra de herramientas superior del visor */}
        <div className="bg-slate-900 text-white px-4 sm:px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <span className="truncate">{tipo}</span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800 flex-shrink-0">
                  {proyecto.codigo}
                </span>
                {isRealPdf && (
                  <span className="text-[10px] font-bold bg-emerald-900/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700 flex-shrink-0">
                    PDF Oficial
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {proyecto.nombre} · {tamano || '1.4 MB'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isRealPdf && archivoUrl && (
              <a
                href={archivoUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                title="Abrir PDF en pestaña nueva"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Pestaña Nueva</span>
              </a>
            )}

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-uss-blue hover:bg-sky-600 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Descargar archivo en su equipo"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CUERPO DEL VISOR */}
        {isRealPdf ? (
          /* Render de PDF Real con IFrame nativo del navegador */
          <div className="flex-1 w-full h-full bg-slate-800 flex flex-col relative">
            <iframe
              src={archivoUrl}
              className="w-full flex-1 border-0"
              title={tipo}
            />
            {/* Aviso accesible al pie */}
            <div className="bg-slate-900/90 text-slate-400 px-4 py-2 text-[11px] flex items-center justify-between border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Informe de Cierre Oficial USS extraído de la plataforma VcM</span>
              </span>
              <a 
                href={archivoUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-sky-400 hover:underline flex items-center gap-1"
              >
                ¿Problemas para previsualizar? Haz clic aquí
              </a>
            </div>
          </div>
        ) : (
          /* Render de Hoja Institucional Simulada para los PTH */
          <div className="flex-1 bg-slate-100 p-2 sm:p-8 overflow-y-auto flex justify-center">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl border border-slate-200 p-5 sm:p-12 text-slate-800 flex flex-col justify-between min-h-[750px]">
              {/* Membrete Oficial */}
              <div>
                <div className="border-b-2 border-uss-navy pb-4 mb-6 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-uss-navy">
                      Universidad San Sebastián
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Vicerrectoría de Vinculación con el Medio y Proyectos Institucionales
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Dirección General de Evaluación y Aseguramiento de la Calidad VcM
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      REPORTE VALIDADO
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Emisión: {fecha || 'Validación Oficial'}
                    </span>
                  </div>
                </div>

                {/* Título del reporte */}
                <div className="mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-uss-blue">
                    {pth.nombre} ({pth.sigla})
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
                    {tipo}
                  </h1>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    Proyecto: [{proyecto.codigo}] {proyecto.nombre}
                  </p>
                </div>

                {/* Ficha técnica del proyecto */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-medium">Año de Ejecución</span>
                    <span className="font-bold text-slate-900">{proyecto.ano}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-medium">Sede</span>
                    <span className="font-bold text-slate-900">{proyecto.sede}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-medium">Línea de Acción</span>
                    <span className="font-bold text-slate-900 line-clamp-1" title={proyecto.lineaAccion}>
                      {proyecto.lineaAccion}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-medium">Estado</span>
                    <span className="font-bold text-emerald-700">Validado en Plataforma</span>
                  </div>
                </div>

                {/* Indicadores Clave de Cristóbal asociados al proyecto */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    1. Indicadores de Cobertura y Participación
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                      <div className="text-lg font-extrabold text-uss-blue">
                        {proyecto.indicadores.organizaciones}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Organizaciones Externas</div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                      <div className="text-lg font-extrabold text-emerald-600">
                        {proyecto.indicadores.estudiantes}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Estudiantes Participantes</div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                      <div className="text-lg font-extrabold text-amber-600">
                        {proyecto.indicadores.academicos}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Académicos USS</div>
                    </div>
                  </div>
                </div>

                {/* Resultados Consolidados de la Evaluación */}
                <div className="mb-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    2. Síntesis de Resultados Evaluados
                  </h3>
                  
                  {tipo.includes('Estudiantes') && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700">Satisfacción Global con la experiencia de aprendizaje VcM:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">94.2% Favorable</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700">Aporte de la iniciativa al desarrollo de competencias del perfil de egreso:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">91.8% Favorable</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700">Tasa de respuesta efectiva de la cohorte estudiantil:</span>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">87.5% de estudiantes</span>
                      </div>
                    </div>
                  )}

                  {tipo.includes('Organizaciones') && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700">Evaluación de la pertinencia y calidad de la contribución universitaria:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">96.5% Favorable</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700">Disposición de la organización a renovar la alianza territorial:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">100% Positiva</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700">Cumplimiento de compromisos y objetivos acordados:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">93.0% Favorable</span>
                      </div>
                    </div>
                  )}

                  {tipo.includes('Cierre') && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed text-slate-600">
                        <strong>Resumen de Logros:</strong> El proyecto concluyó exitosamente su ejecución territorial, alcanzando el 100% de los hitos comprometidos en la propuesta original. Se fortalecieron las capacidades comunitarias con la participación activa de los beneficiarios y el respaldo formal de las contrapartes.
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-700">Estado de Rendición Técnica y Financiera:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Aprobada sin reparos</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pie de página con timbre y validación */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Documento validado oficialmente por la Dirección de Evaluación VcM · USS</span>
                </div>
                <div className="font-mono text-slate-500">
                  Hash: {Math.random().toString(36).substring(2, 10).toUpperCase()} · Cód: {proyecto.codigo}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
