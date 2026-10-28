import React from 'react';
import { 
  Users, 
  Droplet, 
  TreePine, 
  Compass, 
  Network, 
  ArrowRight, 
  Sparkles, 
  FileSpreadsheet, 
  Building2, 
  FileText,
  Clock,
  Layers,
  GraduationCap
} from 'lucide-react';

const iconMap = {
  'pth-mas-personas-mayores': Users,
  'pth-mas-azul': Droplet,
  'pth-mas-parques': TreePine,
  'pth-mas-turismo-sostenible': Compass,
  'pth-mas-sinergia-territorial': Network,
};

export default function PTHSelector({ iniciativas, onSelectInitiative, user }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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
            Este portal consolida las evidencias oficiales (proyectos 2024–2025, reportes validados de encuestas de estudiantes y organizaciones, informes de cierre y métricas clave) para la evaluación de tu iniciativa asignada.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-sky-100">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>5 Programas Territoriales Hito (PTH) Activos</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <FileText className="w-3.5 h-3.5 text-sky-300" />
              <span>Reportes de Evaluación Validados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 1: Programas Territoriales Hito (PTH) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-uss-blue" />
              Programas Territoriales Hito (PTH)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecciona el PTH para acceder a su expediente completo de proyectos y evidencias.
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

      {/* Sección 2: Próximas Iniciativas (Proyectos Colaborativos y Fondos Externos) */}
      <div className="pt-4 border-t border-slate-200">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Otras Iniciativas a Evaluar (En Preparación)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          La jefatura indicará próximamente los proyectos específicos de estas dos categorías para su habilitación en el portal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Proyectos Colaborativos Emblemáticos */}
          <div className="bg-slate-100/70 rounded-2xl p-5 border border-dashed border-slate-300 flex items-start gap-4 opacity-80">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Proyectos Colaborativos Emblemáticos</h3>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  Próximamente
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Iniciativas de alta envergadura y articulación territorial que serán asignadas según indicaciones de la Dirección.
              </p>
            </div>
          </div>

          {/* Card Proyecto con Fondos Externos */}
          <div className="bg-slate-100/70 rounded-2xl p-5 border border-dashed border-slate-300 flex items-start gap-4 opacity-80">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Proyecto con Fondos Externos</h3>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  Próximamente
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Proyecto adjudicado con financiamiento externo nacional/internacional en espera de documentación formal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
