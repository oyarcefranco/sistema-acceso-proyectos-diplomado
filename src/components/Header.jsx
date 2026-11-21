import React from 'react';
import { LogOut, User, ChevronRight, Home, Building, GraduationCap, Shield, ShieldCheck, Globe } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';

export default function Header({ user, currentInitiative, onSelectInitiative, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo Oficial y Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <div 
              onClick={() => onSelectInitiative(null)}
              className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
              title="Ir al inicio de iniciativas"
            >
              {/* Logo Oficial VcM USS */}
              <div className="h-9 sm:h-11 px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center group-hover:border-uss-blue/60 transition shadow-2xs">
                <img 
                  src={getAssetUrl('logos/logo-vcm-uss.png')} 
                  alt="Universidad San Sebastián - Vinculación con el Medio" 
                  className="h-7 sm:h-8 w-auto object-contain"
                  onError={(e) => {
                    // Fallback a versión responsive si falla
                    e.currentTarget.src = getAssetUrl('logos/USS_VcM_logo_responsive.png');
                  }}
                />
              </div>

              <div className="hidden min-[480px]:flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-uss-blue leading-tight">
                  Universidad San Sebastián
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  Portal Diplomado VcM
                </span>
              </div>
            </div>

            {/* Separador y Breadcrumb de navegación */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 pl-3 border-l border-slate-200 overflow-hidden">
              <button 
                onClick={() => onSelectInitiative(null)}
                className={`flex items-center gap-1 hover:text-uss-blue transition font-medium ${
                  !currentInitiative ? 'text-uss-navy font-bold' : ''
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Iniciativas</span>
              </button>

              {currentInitiative && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                    currentInitiative.tipo === 'Proyecto de Continuidad'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {currentInitiative.tipo === 'Proyecto de Continuidad' ? 'Continuidad' : 'PTH'}
                  </span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[240px] lg:max-w-[320px]">
                    {currentInitiative.nombre}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Perfil de Usuario, Badge Administrador y Botón Salir */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* BADGE ESPECIAL ADMINISTRADOR / EQUIPO VCM */}
            {user.isAdmin ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-900 border border-amber-300 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-black tracking-tight uppercase text-amber-950">
                    Administrador / Equipo VcM
                  </span>
                  <span className="text-[9px] text-amber-800 font-semibold leading-none">
                    Auditoría y Gestión Completa
                  </span>
                </div>
              </div>
            ) : (
              /* Detalle de usuario estudiante / académico en Desktop */
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {user.nombre}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-mono text-slate-600">{user.rut}</span>
                  <span>•</span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                    user.tipo === 'Internacional' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-sky-50 text-sky-800 border border-sky-200'
                  }`}>
                    {user.tipo === 'Internacional' ? 'Estudiante Extranjero' : 'Estudiante Regular'}
                  </span>
                </div>
              </div>
            )}

            {/* Versión Compacta en Móvil */}
            <div className="flex sm:hidden items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg max-w-[140px] truncate">
              {user.isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              )}
              <span className="truncate">
                {user.isAdmin ? 'Admin VcM' : (user.nombre.split(',')[0] || user.nombre.split(' ')[0])}
              </span>
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

            {/* Botón Salir */}
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
