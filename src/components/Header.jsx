import React from 'react';
import { LogOut, User, ChevronRight, Home, Building, GraduationCap, Shield } from 'lucide-react';

export default function Header({ user, currentInitiative, onSelectInitiative, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => onSelectInitiative(null)}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-uss-navy to-uss-blue flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-uss-yellow" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-uss-blue">
                  Universidad San Sebastián
                </span>
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  Portal Diplomado VcM
                </span>
              </div>
            </div>

            {/* Separator and Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 pl-4 border-l border-slate-200">
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
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {currentInitiative.nombre}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop user details */}
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {user.nombre}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-mono text-slate-600">{user.rut}</span>
                <span>•</span>
                <span className={`px-1.5 py-0.2 rounded font-medium ${
                  user.tipo === 'Interno' ? 'bg-sky-50 text-sky-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  {user.tipo}
                </span>
              </div>
            </div>

            {/* Mobile user pill */}
            <div className="flex sm:hidden items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg max-w-[130px] truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span className="truncate">{user.nombre.split(' ')[0]} {user.nombre.split(' ')[1] || ''}</span>
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 text-xs font-semibold transition cursor-pointer"
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
