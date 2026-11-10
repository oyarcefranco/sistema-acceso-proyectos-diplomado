import React from 'react';
import { 
  Users, 
  Droplet, 
  TreePine, 
  Compass, 
  Network, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  FileText,
  Clock,
  Layers,
  GraduationCap,
  History,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  'pth-mas-personas-mayores': Users,
  'pth-mas-azul': Droplet,
  'pth-mas-parques': TreePine,
  'pth-mas-turismo-sostenible': Compass,
  'pth-mas-sinergia-territorial': Network,
};

export default function PTHSelector({ 
  iniciativas, 
  proyectosContinuidad = [], 
  onSelectInitiative, 
  onSelectContinuityProject, 
  user 
}) {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Banner de Bienvenida y Contexto */}
      <div className="bg-gradient-to-r from-uss-navy via-[#00385e] to-uss-blue rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-uss-yellow" />
            <span>Diplomado en Vinculación con el Medio · Trabajo Final</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenido/a, {user.nombre}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed">
            Este portal consolida las evidencias oficiales (proyectos 2024–2025, reportes validados de encuestas, informes de cierre y proyectos de continuidad con trayectoria multianual) para la evaluación de tu iniciativa asignada.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-sky-100">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>5 Programas Territoriales Hito (PTH)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <History className="w-3.5 h-3.5 text-purple-300" />
              <span>4 Proyectos de Continuidad (19 Informes de Cierre)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 1: PROYECTOS DE CONTINUIDAD (CON INFORMES REALES) */}
      {/* ========================================================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <span>Proyectos Colaborativos Emblemáticos (Proyectos de Continuidad)</span>
              </h2>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                Informes Disponibles
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Iniciativas de alto impacto territorial ejecutadas durante múltiples años. Cada año cuenta con un ID único e informe de cierre descargable.
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full self-start sm:self-auto">
            {proyectosContinuidad.length} Iniciativas · 19 Informes de Cierre
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {proyectosContinuidad.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectContinuityProject && onSelectContinuityProject(proj)}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1 relative"
            >
              {/* Barra lateral de acento púrpura */}
              <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-b from-purple-600 to-indigo-700" />

              <div className="p-6 pl-7">
                {/* Metadatos superiores */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <History className="w-3 h-3" />
                      Continuidad
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {proj.sede}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {proj.totalVersiones} Años
                  </span>
                </div>

                {/* Título limpio sin sede */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                  {proj.nombre}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {proj.descripcion}
                </p>

                {/* Desglose de IDs y Años */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Versiones anuales con Informe de Cierre:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {proj.versiones.map((v) => (
                      <span
                        key={v.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-200"
                      >
                        <span className="font-bold text-slate-900">{v.ano}:</span>
                        <span className="font-mono text-[10px] text-purple-700">{v.codigo}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer de la tarjeta */}
              <div className="bg-slate-50/90 px-6 pl-7 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-900 group-hover:text-purple-700">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Ver Desglose de Informes ({proj.totalVersiones} PDFs)</span>
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 2: PROGRAMAS TERRITORIALES HITO (PTH)            */}
      {/* ========================================================= */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-uss-blue" />
              Programas Territoriales Hito (PTH)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Programas transversales con proyectos 2024–2025, encuestas validadas e indicadores de gestión.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            5 Programas Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {iniciativas.map((pth) => {
            const Icon = iconMap[pth.id] || Layers;
            return (
              <div
                key={pth.id}
                onClick={() => onSelectInitiative(pth)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-uss-blue shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1"
              >
                {/* Header de la tarjeta */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pth.color.primary} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${pth.color.badge}`}>
                      {pth.sigla}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-uss-blue transition-colors line-clamp-1">
                    {pth.nombre}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {pth.descripcion}
                  </p>
                </div>

                {/* Métricas e Indicadores Consolidados */}
                <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-xs">
                      <div className="text-xs font-bold text-slate-800">
                        {pth.totales.proyectos}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Proyectos</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-xs">
                      <div className="text-xs font-bold text-emerald-700">
                        {pth.totales.organizaciones}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Organizaciones</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-xs">
                      <div className="text-xs font-bold text-uss-blue">
                        {pth.totales.estudiantes}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Estudiantes</div>
                    </div>
                  </div>

                  {/* Botón de acceso */}
                  <div className="mt-3.5 flex items-center justify-between text-xs font-bold text-uss-navy group-hover:text-uss-blue pt-1">
                    <span>Revisar Proyectos y Reportes</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
