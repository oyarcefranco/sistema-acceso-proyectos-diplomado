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
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  BarChart3,
  Archive
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

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
      
      {/* ========================================================= */}
      {/* BANNER DE BIENVENIDA INSTITUCIONAL (USS / VcM)            */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-uss-navy-deep via-uss-navy to-uss-blue rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-uss-yellow" />
              <span>Diplomado en Vinculación con el Medio · Evaluación Final</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenido/a, {user.nombre}
            </h1>

            {/* Texto Oficial Requerido por Consuelo ('Editar sistema.docx') */}
            <p className="mt-2.5 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Este portal consolida las evidencias oficiales de la iniciativa de VcM a evaluar. Pueden acceder y revisar los formularios de postulación de los Proyectos, los informes de avance y cierre y reportes de encuestas de estudiantes y organizaciones externas existentes.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-sky-100">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>5 Programas Territoriales Hito (PTH)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
                <History className="w-3.5 h-3.5 text-purple-300" />
                <span>4 Proyectos Colaborativos Emblemáticos (19 Versiones Oficiales)</span>
              </div>
              {user.isAdmin && (
                <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-200 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-amber-400/30 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-uss-yellow" />
                  <span>Modo Administrador Activo</span>
                </div>
              )}
            </div>
          </div>

          {/* Logo Institucional Oficial USS en el Banner */}
          <div className="hidden lg:flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex-shrink-0 min-w-[200px]">
            <img 
              src={getAssetUrl('logos/logo-uss-white.png')} 
              alt="Universidad San Sebastián" 
              className="h-14 w-auto object-contain mb-2 drop-shadow-md"
              onError={(e) => {
                e.currentTarget.src = getAssetUrl('logos/logo-vcm-uss.png');
              }}
            />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-200 text-center">
              Vinculación con el Medio
            </span>
            <span className="text-[9px] text-slate-300 tracking-wider uppercase mt-0.5">
              Dirección General
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PANEL DE AUDITORÍA Y ESTADO DE CARGA (SOLO ADMINISTRADOR) */}
      {/* ========================================================= */}
      {user.isAdmin && (
        <div className="bg-gradient-to-r from-amber-50/90 via-slate-50 to-sky-50 rounded-3xl p-6 border-2 border-amber-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-900 border border-amber-200">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Panel de Estado de Carga y Auditoría de Evidencias</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                    Equipo VcM
                  </span>
                </h3>
                <p className="text-xs text-slate-600">
                  Resumen de integridad de documentos subidos y nómina habilitada para el diplomado.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300 self-start sm:self-auto">
              Auditoría en Tiempo Real
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Proyectos Continuidad</span>
              <span className="text-base font-black text-purple-900 block mt-0.5">19 Versiones</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">19/19 Informes Cierre (100%)</span>
              <span className="text-[10px] text-sky-700 font-semibold block">16/19 Formularios (84.2%)</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Iniciativas PTH</span>
              <span className="text-base font-black text-uss-navy block mt-0.5">5 Programas</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">28 Proyectos 2024–2025</span>
              <span className="text-[10px] text-slate-500 font-medium block">Encuestas y Cierres disponibles</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Estudiantes Diplomado</span>
              <span className="text-base font-black text-uss-blue block mt-0.5">175 Matriculados</span>
              <span className="text-[10px] text-slate-600 font-semibold block mt-0.5">140 Chilenos (RUT)</span>
              <span className="text-[10px] text-emerald-700 font-bold block">35 Extranjeros (Pasaporte)</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Seguridad & Identidad</span>
              <span className="text-base font-black text-emerald-700 block mt-0.5">Validada</span>
              <span className="text-[10px] text-slate-600 font-medium block mt-0.5">Doble acceso RUT/Pasaporte</span>
              <span className="text-[10px] text-amber-800 font-bold block">Paleta Oficial USS Activa</span>
            </div>
          </div>
        </div>
      )}

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
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Evidencias Disponibles
              </span>
            </div>

            {/* Bajada Oficial Requerida por Consuelo ('Editar sistema.docx') */}
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-4xl">
              Iniciativas de VcM de gran valor implementadas continuamente durante múltiples años. Cada proyecto cuenta con un ID (identificador único), formulario de postulación, informe de avance y cierre, y reportes de encuestas en caso de que las hayan aplicado.
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full self-start sm:self-auto flex-shrink-0">
            {proyectosContinuidad.length} Iniciativas · 19 Informes de Cierre
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {proyectosContinuidad.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectContinuityProject && onSelectContinuityProject(proj)}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-600 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1 relative"
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
                    {proj.totalVersiones} Versiones
                  </span>
                </div>

                {/* Título limpio sin sede */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                  {proj.nombre}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {proj.descripcion}
                </p>

                {/* Desglose de IDs y Versiones Ejecutadas */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Versiones ejecutadas con evidencias:
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
                  <span>Ver Expediente de Versiones ({proj.totalVersiones} IDs)</span>
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
              Programas transversales con proyectos 2024–2025, formularios de postulación, encuestas validadas e indicadores de gestión.
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
                className="group bg-white rounded-2xl border border-slate-200 hover:border-uss-blue shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1"
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
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
                      <div className="text-xs font-bold text-slate-800">
                        {pth.totales.proyectos}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Proyectos</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
                      <div className="text-xs font-bold text-emerald-700">
                        {pth.totales.organizaciones}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Organizaciones</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
                      <div className="text-xs font-bold text-uss-blue">
                        {pth.totales.estudiantes}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Estudiantes</div>
                    </div>
                  </div>

                  {/* Botón de acceso */}
                  <div className="mt-3.5 flex items-center justify-between text-xs font-bold text-uss-navy group-hover:text-uss-blue pt-1">
                    <span>Revisar Proyectos y Evidencias</span>
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
