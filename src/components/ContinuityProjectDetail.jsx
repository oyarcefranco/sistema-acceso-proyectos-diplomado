import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  Archive, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ExternalLink,
  History,
  Tag,
  MapPin,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import JSZip from 'jszip';

export default function ContinuityProjectDetail({ project, onBack, onOpenDocument }) {
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (más reciente primero) o 'asc'
  const [isZipping, setIsZipping] = useState(false);

  // Ordenar versiones según año
  const sortedVersiones = [...project.versiones].sort((a, b) => {
    return sortOrder === 'desc' ? b.ano - a.ano : a.ano - b.ano;
  });

  // Descarga del expediente histórico completo en ZIP con los PDFs reales
  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `Expediente_Continuidad_${project.nombre.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const rootFolder = zip.folder(folderName);

      // Crear archivo índice de versiones
      let readme = `UNIVERSIDAD SAN SEBASTIÁN - VINCULACIÓN CON EL MEDIO\n`;
      readme += `EXPEDIENTE HISTÓRICO DE PROYECTO DE CONTINUIDAD\n`;
      readme += `Proyecto: ${project.nombre}\n`;
      readme += `Sede: ${project.sede}\n`;
      readme += `Trayectoria: ${project.periodoTrayectoria}\n`;
      readme += `Total de Versiones Ejecutadas: ${project.totalVersiones}\n\n`;
      readme += `DESGLOSE CRONOLÓGICO DE VERSIONES E INFORMES DE CIERRE:\n`;
      readme += `---------------------------------------------------------\n`;

      for (const ver of project.versiones) {
        readme += `• Año ${ver.ano} | ${ver.codigo} | ${ver.tipo}\n`;
        readme += `  Período: ${ver.periodo}\n`;
        readme += `  Carreras: ${ver.carreras.join(', ')}\n`;
        readme += `  Archivo: ${ver.nombreDescarga} (${ver.tamano})\n\n`;

        // Descargar el archivo PDF real y agregarlo al ZIP
        try {
          const response = await fetch(ver.archivo);
          if (response.ok) {
            const blob = await response.blob();
            rootFolder.file(ver.nombreDescarga, blob);
          }
        } catch (fetchErr) {
          console.warn(`No se pudo agregar al ZIP ${ver.archivo}:`, fetchErr);
        }
      }

      rootFolder.file('00_INDICE_EXPEDIENTE_HISTORICO.txt', readme);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al generar ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

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

      {/* Cabecera Principal del Proyecto de Continuidad */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-3xl">
            {/* Badges de clasificación */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                Proyecto de Continuidad
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {project.sede}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {project.totalVersiones} Versiones Anuales
              </span>
            </div>

            {/* Título limpio sin sede */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {project.nombre}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {project.descripcion}
            </p>

            {/* Carreras Participantes a lo largo de los años */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-2">
                Carreras y Disciplinas Participantes en su Trayectoria:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {project.carrerasParticipantes.map((carrera) => (
                  <span
                    key={carrera}
                    className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200/70"
                  >
                    {carrera}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Botón de Descarga Consolidada de todos los informes */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-uss-navy hover:bg-uss-blue text-white font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-70"
              title="Descargar todos los informes de cierre en un archivo ZIP"
            >
              <Archive className="w-4 h-4 text-sky-300" />
              <span>{isZipping ? 'Comprimiendo PDFs...' : 'Descargar Todos los Informes (ZIP)'}</span>
            </button>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
              <span className="text-[11px] font-semibold text-purple-800 block">
                Trayectoria Documentada
              </span>
              <span className="text-xs font-extrabold text-purple-900 block mt-0.5">
                {project.periodoTrayectoria}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de control y ordenamiento del Desglose */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-uss-blue" />
            <span>Desglose Cronológico por ID y Año de Ejecución</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada año la iniciativa generó un código ID único en la plataforma VcM con su respectivo informe de cierre oficial.
          </p>
        </div>

        {/* Toggle Orden Cronológico */}
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer self-end sm:self-auto"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span>{sortOrder === 'desc' ? 'Más reciente primero (2025 → 2020)' : 'Más antiguo primero (2020 → 2025)'}</span>
        </button>
      </div>

      {/* Línea de Tiempo / Tarjetas de cada Versión e ID */}
      <div className="space-y-4">
        {sortedVersiones.map((ver, idx) => (
          <div
            key={ver.id}
            className="group bg-white rounded-2xl border-2 border-slate-200/90 hover:border-uss-blue shadow-xs hover:shadow-md transition-all duration-200 p-5 sm:p-6 relative overflow-hidden"
          >
            {/* Barra lateral de acento */}
            <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-b from-purple-600 to-indigo-700" />

            <div className="pl-3 sm:pl-4 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              {/* Información de la Versión Anual */}
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold px-3 py-1 rounded-lg bg-uss-navy text-white shadow-2xs">
                    Año {ver.ano}
                  </span>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                    {ver.codigo}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    {ver.tipo}
                  </span>
                </div>

                {/* Período de Ejecución */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Período de ejecución: <strong>{ver.periodo}</strong></span>
                </div>

                {/* Carreras Participantes en este Año */}
                {ver.carreras && ver.carreras.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Carreras Participantes ({ver.carreras.length}):
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {ver.carreras.map((c) => (
                        <span
                          key={c}
                          className="bg-slate-50 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200/60"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de Acción para el Documento Real */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 flex-shrink-0 lg:min-w-[200px] pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between lg:justify-end gap-2 mb-1">
                  <span>{ver.paginas} páginas</span>
                  <span>•</span>
                  <span>{ver.tamano}</span>
                </div>

                {/* Ver PDF Real en el Modal */}
                <button
                  onClick={() => onOpenDocument({
                    tipo: `Informe de Cierre (${ver.codigo} - Año ${ver.ano})`,
                    proyecto: {
                      codigo: ver.codigo,
                      nombre: project.nombre,
                      ano: ver.ano,
                      sede: ver.sede,
                      lineaAccion: ver.tipo,
                      indicadores: {
                        organizaciones: 'Según Informe',
                        estudiantes: 'Ver Detalle',
                        academicos: 'Equipo Docente'
                      }
                    },
                    pth: {
                      nombre: project.nombre,
                      sigla: `CONTINUIDAD ${ver.codigo}`
                    },
                    archivo: ver.archivo,
                    tamano: ver.tamano,
                    fecha: ver.periodo,
                    isRealPdf: true,
                    archivoUrl: ver.archivo,
                    nombreDescarga: ver.nombreDescarga
                  })}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
                  title="Abrir y leer el informe oficial en el visor integrado"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Informe de Cierre</span>
                </button>

                {/* Descarga Directa del PDF Real */}
                <a
                  href={ver.archivo}
                  download={ver.nombreDescarga}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs transition cursor-pointer border border-slate-200 text-center"
                  title="Descargar archivo PDF oficial en su computador"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PDF</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

