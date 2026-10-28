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
  Tag
} from 'lucide-react';

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
          filteredProjects.map((p, idx) => {
            const docEst = p.documentos.encuestaEstudiantes;
            const docOrg = p.documentos.encuestaOrganizaciones;
            const docCierre = p.documentos.informeCierre;

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

                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{p.lineaAccion}</span>
                  </div>
                </div>

                {/* Métricas Cristóbal en Móvil (3 cajitas) */}
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

                {/* Documentos en Móvil: Botones grandes y táctiles */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Documentos y Evidencias:
                  </span>

                  {/* 1. Encuesta Estudiantes */}
                  {docEst.disponible ? (
                    <button
                      onClick={() => onOpenDocument({
                        tipo: 'Reporte Validado Encuesta Estudiantes',
                        proyecto: p,
                        pth,
                        archivo: docEst.archivo,
                        tamano: docEst.tamano,
                        fecha: docEst.fecha
                      })}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sky-50/80 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-900 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-sky-600" />
                        <span>Encuesta Estudiantes</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-sky-700 border border-sky-200">
                        <Eye className="w-3 h-3" /> Ver PDF
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span>Encuesta Estudiantes</span>
                      </span>
                      <span className="text-[10px] bg-slate-200/70 px-2 py-0.5 rounded text-slate-600 font-medium">
                        {docEst.estado}
                      </span>
                    </div>
                  )}

                  {/* 2. Encuesta Organizaciones */}
                  {docOrg.disponible ? (
                    <button
                      onClick={() => onOpenDocument({
                        tipo: 'Reporte Validado Encuesta Organizaciones',
                        proyecto: p,
                        pth,
                        archivo: docOrg.archivo,
                        tamano: docOrg.tamano,
                        fecha: docOrg.fecha
                      })}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-900 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>Encuesta Organizaciones</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <Eye className="w-3 h-3" /> Ver PDF
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>Encuesta Organizaciones</span>
                      </span>
                      <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded text-amber-800 font-medium">
                        {docOrg.estado}
                      </span>
                    </div>
                  )}

                  {/* 3. Informe de Cierre */}
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
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200 text-xs font-semibold text-purple-900 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>Informe de Cierre</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-purple-700 border border-purple-200">
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
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* VISTA 2: FILAS CARD INDEPENDIENTES EN DESKTOP (hidden md) */}
      {/* Con separación visual nítida y banda de color            */}
      {/* ======================================================== */}
      <div className="hidden md:block space-y-3.5">
        {filteredProjects.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 shadow-xs">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">No se encontraron proyectos con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredProjects.map((p) => {
            const docEst = p.documentos.encuestaEstudiantes;
            const docOrg = p.documentos.encuestaOrganizaciones;
            const docCierre = p.documentos.informeCierre;

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
                <div className="pl-3 max-w-md lg:max-w-lg">
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

                  <div className="mt-2">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200/70">
                      {p.lineaAccion}
                    </span>
                  </div>
                </div>

                {/* Columna 2: Indicadores Cristóbal (Tarjetas nítidas) */}
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

                {/* Columna 3: Documentos (Botones con alta visibilidad y estado claro) */}
                <div className="flex flex-col gap-1.5 flex-shrink-0 min-w-[260px] pl-4 border-l-2 border-slate-100">
                  {/* Encuesta Estudiantes */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                      Enc. Estudiantes:
                    </span>
                    {docEst.disponible ? (
                      <button
                        onClick={() => onOpenDocument({
                          tipo: 'Reporte Validado Encuesta Estudiantes',
                          proyecto: p,
                          pth,
                          archivo: docEst.archivo,
                          tamano: docEst.tamano,
                          fecha: docEst.fecha
                        })}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                        title="Ver reporte oficial validado"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Validado</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {docEst.estado}
                      </span>
                    )}
                  </div>

                  {/* Encuesta Organizaciones */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      Enc. Organizaciones:
                    </span>
                    {docOrg.disponible ? (
                      <button
                        onClick={() => onOpenDocument({
                          tipo: 'Reporte Validado Encuesta Organizaciones',
                          proyecto: p,
                          pth,
                          archivo: docOrg.archivo,
                          tamano: docOrg.tamano,
                          fecha: docOrg.fecha
                        })}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                        title="Ver reporte oficial validado"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Validado</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                        {docOrg.estado}
                      </span>
                    )}
                  </div>

                  {/* Informe de Cierre */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
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
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
