import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Building2, 
  Users, 
  GraduationCap, 
  Eye, 
  AlertCircle,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  FileCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

// Estilo distintivo por Línea de Acción institucional
const getLineaAccionBadge = (linea) => {
  const l = (linea || '').toLowerCase();
  if (l.includes('salud') || l.includes('funcionalidad')) {
    return {
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      dot: 'bg-amber-500'
    };
  } else if (l.includes('emocional') || l.includes('cognitivo') || l.includes('psico')) {
    return {
      bg: 'bg-purple-50 text-purple-900 border-purple-300',
      dot: 'bg-purple-500'
    };
  } else if (l.includes('digital') || l.includes('inclusión') || l.includes('social') || l.includes('comunit')) {
    return {
      bg: 'bg-sky-50 text-sky-900 border-sky-300',
      dot: 'bg-sky-500'
    };
  } else if (l.includes('agua') || l.includes('humedal') || l.includes('cuenca') || l.includes('lago')) {
    return {
      bg: 'bg-cyan-50 text-cyan-900 border-cyan-300',
      dot: 'bg-cyan-500'
    };
  } else if (l.includes('parque') || l.includes('flora') || l.includes('verde') || l.includes('sostenib') || l.includes('sustentab')) {
    return {
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      dot: 'bg-emerald-500'
    };
  } else if (l.includes('turismo') || l.includes('patrimonio') || l.includes('ruta')) {
    return {
      bg: 'bg-teal-50 text-teal-900 border-teal-300',
      dot: 'bg-teal-500'
    };
  } else {
    return {
      bg: 'bg-indigo-50 text-indigo-900 border-indigo-300',
      dot: 'bg-indigo-500'
    };
  }
};

export default function ProjectsTable({ pth, onOpenDocument }) {
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [selectedLinea, setSelectedLinea] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado reactivo en vivo
  const filteredProjects = useMemo(() => {
    return pth.proyectos.filter((p) => {
      // Filtro por año
      if (selectedYear !== 'Todos' && p.ano.toString() !== selectedYear) {
        return false;
      }
      // Filtro por línea de acción
      if (selectedLinea !== 'Todas' && p.lineaAccion !== selectedLinea) {
        return false;
      }
      // Filtro por búsqueda de texto
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchName = p.nombre.toLowerCase().includes(term);
        const matchCode = p.codigo.toLowerCase().includes(term);
        const matchSede = p.sede.toLowerCase().includes(term);
        if (!matchName && !matchCode && !matchSede) return false;
      }
      return true;
    });
  }, [pth.proyectos, selectedYear, selectedLinea, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda (100% Mobile Responsive) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Buscador de texto */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por proyecto, código (ej: VCM-24) o sede..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-uss-blue focus:border-transparent transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtros por Año y Línea */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Selector de Año */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold justify-center">
            {['Todos', '2024', '2025'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition cursor-pointer text-center ${
                  selectedYear === yr
                    ? 'bg-white text-uss-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Selector de Línea de Acción */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedLinea}
              onChange={(e) => setSelectedLinea(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-uss-blue text-slate-700 cursor-pointer"
            >
              <option value="Todas">Todas las Líneas de Acción</option>
              {pth.lineasDeAccion.map((linea) => (
                <option key={linea} value={linea}>
                  {linea}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resumen de resultados */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Mostrando <strong>{filteredProjects.length}</strong> de {pth.proyectos.length} proyectos asociados
        </span>
        {(selectedYear !== 'Todos' || selectedLinea !== 'Todas' || searchTerm) && (
          <button
            onClick={() => {
              setSelectedYear('Todos');
              setSelectedLinea('Todas');
              setSearchTerm('');
            }}
            className="text-uss-blue hover:underline font-semibold cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* VISTA 1: TARJETAS EN MÓVIL (block md:hidden)              */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-xs">No se encontraron proyectos con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredProjects.map((p) => {
            const docPost = p.documentos.formularioPostulacion || {
              disponible: true,
              estado: 'Disponible',
              archivo: `documentos/${pth.id}/formularios-postulacion/Formulario_Postulacion_${p.codigo}.pdf`,
              tamano: '1.8 MB',
              fecha: `Mar ${p.ano}`
            };
            const docEst = p.documentos.encuestaEstudiantes;
            const docOrg = p.documentos.encuestaOrganizaciones;
            const docCierre = p.documentos.informeCierre;
            const lineaBadge = getLineaAccionBadge(p.lineaAccion);

            return (
              <div 
                key={p.id}
                className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm p-4.5 space-y-3.5 relative overflow-hidden"
              >
                {/* Banda de color según año a la izquierda */}
                <div className={`absolute top-0 left-0 bottom-0 w-2 ${
                  p.ano === 2024 ? 'bg-uss-blue' : 'bg-emerald-500'
                }`} />

                {/* Encabezado del Proyecto Móvil */}
                <div className="pl-2">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {p.codigo}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        p.ano === 2024 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Año {p.ano}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.sede}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {p.nombre}
                  </h4>

                  {/* Badge Distintivo de Línea de Acción */}
                  <div className="mt-2.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border shadow-2xs ${lineaBadge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${lineaBadge.dot}`}></span>
                      <span>{p.lineaAccion}</span>
                    </span>
                  </div>
                </div>

                {/* Métricas de Impacto VcM en Móvil */}
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/60">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200/50 shadow-2xs">
                    <div className="text-xs font-extrabold text-slate-800">{p.indicadores.organizaciones}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Orgs</div>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200/50 shadow-2xs">
                    <div className="text-xs font-extrabold text-emerald-700">{p.indicadores.estudiantes}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Estudiantes</div>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200/50 shadow-2xs">
                    <div className="text-xs font-extrabold text-uss-blue">{p.indicadores.academicos}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Académicos</div>
                  </div>
                </div>

                {/* Documentos en Móvil: Las 4 Evidencias Oficiales */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Documentos y Evidencias Oficiales:
                  </span>

                  {/* 1. Formulario de Postulación */}
                  <button
                    onClick={() => onOpenDocument({
                      tipo: 'Formulario de Postulación de Proyecto',
                      proyecto: p,
                      pth,
                      archivo: docPost.archivo,
                      tamano: docPost.tamano,
                      fecha: docPost.fecha
                    })}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sky-50/90 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-950 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-sky-600" />
                      <span>Formulario Postulación</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-sky-700 border border-sky-200 shadow-2xs">
                      <Eye className="w-3 h-3" /> Ver PDF
                    </span>
                  </button>

                  {/* 2. Informe de Cierre */}
                  {docCierre.disponible ? (
                    <button
                      onClick={() => onOpenDocument({
                        tipo: 'Informe de Cierre de Proyecto',
                        proyecto: p,
                        pth,
                        archivo: docCierre.archivo,
                        tamano: docCierre.tamano,
                        fecha: docCierre.fecha
                      })}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-50/90 hover:bg-purple-100 border border-purple-200 text-xs font-semibold text-purple-950 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>Informe de Cierre</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-purple-700 border border-purple-200 shadow-2xs">
                        <Eye className="w-3 h-3" /> Ver PDF
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>Informe de Cierre</span>
                      </span>
                      <span className="text-[10px] bg-slate-200/70 px-2 py-0.5 rounded text-slate-600 font-medium">
                        {docCierre.estado}
                      </span>
                    </div>
                  )}

                  {/* 3. Encuesta Estudiantes */}
                  {docEst.disponible ? (
                    <button
                      onClick={() => onOpenDocument({
                        tipo: docEst.tipoReporte || (docEst.esEspecifico ? 'Reporte Validado Encuesta Estudiantes' : `Reporte General Estudiantes (${pth.sigla} ${p.ano})`),
                        proyecto: p,
                        pth,
                        archivo: docEst.archivo,
                        tamano: docEst.tamano,
                        nombreDescarga: docEst.nombreDescarga
                      })}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        docEst.esEspecifico
                          ? 'bg-blue-50/80 hover:bg-blue-100 border-blue-200 text-blue-900'
                          : 'bg-sky-50/80 hover:bg-sky-100 border-sky-300 text-sky-950'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-uss-blue" />
                        <span>Encuesta Estudiantes</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-blue-700 border border-blue-200 shadow-2xs">
                        <Eye className="w-3 h-3" /> {docEst.esEspecifico ? 'Ver PDF' : 'Reporte PTH'}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span>Encuesta Estudiantes</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                        {docEst.estado || 'No disponible'}
                      </span>
                    </div>
                  )}

                  {/* 4. Encuesta Organizaciones */}
                  {docOrg.disponible ? (
                    <button
                      onClick={() => onOpenDocument({
                        tipo: docOrg.tipoReporte || (docOrg.esEspecifico ? 'Reporte Validado Encuesta Organizaciones' : `Reporte General Organizaciones (${pth.sigla} ${p.ano})`),
                        proyecto: p,
                        pth,
                        archivo: docOrg.archivo,
                        tamano: docOrg.tamano,
                        nombreDescarga: docOrg.nombreDescarga
                      })}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        docOrg.esEspecifico
                          ? 'bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200 text-emerald-900'
                          : 'bg-teal-50/80 hover:bg-teal-100 border-teal-300 text-teal-950'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>Encuesta Organizaciones</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
                        <Eye className="w-3 h-3" /> {docOrg.esEspecifico ? 'Ver PDF' : 'Reporte PTH'}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>Encuesta Organizaciones</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                        {docOrg.estado || 'No disponible'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* VISTA 2: FILAS CARD INDEPENDIENTES EN DESKTOP (hidden md) */}
      {/* ======================================================== */}
      <div className="hidden md:block space-y-3.5">
        {filteredProjects.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 shadow-xs">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">No se encontraron proyectos con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredProjects.map((p) => {
            const docPost = p.documentos.formularioPostulacion || {
              disponible: true,
              estado: 'Disponible',
              archivo: `documentos/${pth.id}/formularios-postulacion/Formulario_Postulacion_${p.codigo}.pdf`,
              tamano: '1.8 MB',
              fecha: `Mar ${p.ano}`
            };
            const docEst = p.documentos.encuestaEstudiantes;
            const docOrg = p.documentos.encuestaOrganizaciones;
            const docCierre = p.documentos.informeCierre;
            const lineaBadge = getLineaAccionBadge(p.lineaAccion);

            return (
              <div
                key={p.id}
                className="group bg-white rounded-2xl border-2 border-slate-200/80 hover:border-uss-blue/60 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Banda de acento lateral según año */}
                <div className={`absolute top-0 left-0 bottom-0 w-2.5 transition-colors ${
                  p.ano === 2024 ? 'bg-uss-blue' : 'bg-emerald-500'
                }`} />

                {/* Columna 1: Información del Proyecto */}
                <div className="pl-3 max-w-sm lg:max-w-md xl:max-w-lg flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {p.codigo}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      p.ano === 2024 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.ano}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {p.sede}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-uss-blue transition-colors leading-snug">
                    {p.nombre}
                  </h4>

                  {/* Badge Distintivo de Línea de Acción */}
                  <div className="mt-2.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border shadow-2xs ${lineaBadge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${lineaBadge.dot}`}></span>
                      <span>{p.lineaAccion}</span>
                    </span>
                  </div>
                </div>

                {/* Columna 2: Indicadores Oficiales de Impacto VcM */}
                <div className="flex items-center gap-2 flex-shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-center px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs min-w-[62px]">
                    <div className="text-sm font-extrabold text-slate-800">{p.indicadores.organizaciones}</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Orgs</div>
                  </div>
                  <div className="text-center px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs min-w-[68px]">
                    <div className="text-sm font-extrabold text-emerald-700">{p.indicadores.estudiantes}</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Estudiantes</div>
                  </div>
                  <div className="text-center px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs min-w-[66px]">
                    <div className="text-sm font-extrabold text-uss-blue">{p.indicadores.academicos}</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Académicos</div>
                  </div>
                </div>

                {/* Columna 3: Documentos (Visualización y Descarga de las 4 Evidencias) */}
                <div className="flex flex-col gap-1.5 flex-shrink-0 min-w-[280px] lg:min-w-[310px] pl-4 border-l-2 border-slate-100">
                  
                  {/* 1. Formulario de Postulación */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                      Formulario Postulación:
                    </span>
                    <button
                      onClick={() => onOpenDocument({
                        tipo: 'Formulario de Postulación de Proyecto',
                        proyecto: p,
                        pth,
                        archivo: docPost.archivo,
                        tamano: docPost.tamano,
                        fecha: docPost.fecha
                      })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                      title="Ver formulario oficial de postulación"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Disponible</span>
                    </button>
                  </div>

                  {/* 2. Informe de Cierre */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                      Informe Cierre:
                    </span>
                    {docCierre.disponible ? (
                      <button
                        onClick={() => onOpenDocument({
                          tipo: 'Informe de Cierre de Proyecto',
                          proyecto: p,
                          pth,
                          archivo: docCierre.archivo,
                          tamano: docCierre.tamano,
                          fecha: docCierre.fecha
                        })}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                        title="Ver informe oficial de cierre"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Finalizado</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {docCierre.estado}
                      </span>
                    )}
                  </div>

                  {/* 3. Encuesta Estudiantes */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-uss-blue" />
                      Enc. Estudiantes:
                    </span>
                    {docEst.disponible ? (
                      <button
                        onClick={() => onOpenDocument({
                          tipo: docEst.tipoReporte || (docEst.esEspecifico ? 'Reporte Validado Encuesta Estudiantes' : `Reporte General Estudiantes (${pth.sigla} ${p.ano})`),
                          proyecto: p,
                          pth,
                          archivo: docEst.archivo,
                          tamano: docEst.tamano,
                          nombreDescarga: docEst.nombreDescarga
                        })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs ${
                          docEst.esEspecifico
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                            : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-300'
                        }`}
                        title={docEst.esEspecifico ? "Ver encuesta oficial específica de este proyecto" : `Ver reporte general de encuesta a estudiantes (${pth.sigla} ${p.ano})`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{docEst.esEspecifico ? 'Validado' : 'Reporte PTH'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {docEst.estado || 'No disponible'}
                      </span>
                    )}
                  </div>

                  {/* 4. Encuesta Organizaciones */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      Enc. Organizaciones:
                    </span>
                    {docOrg.disponible ? (
                      <button
                        onClick={() => onOpenDocument({
                          tipo: docOrg.tipoReporte || (docOrg.esEspecifico ? 'Reporte Validado Encuesta Organizaciones' : `Reporte General Organizaciones (${pth.sigla} ${p.ano})`),
                          proyecto: p,
                          pth,
                          archivo: docOrg.archivo,
                          tamano: docOrg.tamano,
                          nombreDescarga: docOrg.nombreDescarga
                        })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs ${
                          docOrg.esEspecifico
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-300'
                        }`}
                        title={docOrg.esEspecifico ? "Ver encuesta oficial específica a organizaciones" : `Ver reporte general de encuesta a organizaciones (${pth.sigla} ${p.ano})`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{docOrg.esEspecifico ? 'Validado' : 'Reporte PTH'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {docOrg.estado || 'No disponible'}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
