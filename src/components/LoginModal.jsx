import React, { useState } from 'react';
import { formatRut, cleanRut, validateRut } from '../utils/rutValidator';
import whitelist from '../data/whitelist.json';
import { ShieldCheck, UserCheck, AlertCircle, Sparkles, Building2, GraduationCap } from 'lucide-react';

export default function LoginModal({ onLoginSuccess }) {
  const [rutInput, setRutInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const raw = e.target.value;
    const formatted = formatRut(raw);
    setRutInput(formatted);
    if (error) setError('');
  };

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    const cleaned = cleanRut(rutInput);
    if (!cleaned) {
      setError('Por favor, ingresa tu RUT.');
      return;
    }

    if (!validateRut(cleaned)) {
      setError('El RUT ingresado no es válido. Revisa los dígitos.');
      return;
    }

    setIsSubmitting(true);

    // Buscar en la lista blanca
    setTimeout(() => {
      const user = whitelist.find((u) => cleanRut(u.rut) === cleaned);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Este RUT no se encuentra habilitado en la nómina del Diplomado VcM. Si crees que es un error, contacta a la coordinación.');
        setIsSubmitting(false);
      }
    }, 300);
  };

  const handleQuickLogin = (testUser) => {
    setRutInput(formatRut(testUser.rut));
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(testUser);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera institucional */}
        <div className="bg-gradient-to-r from-uss-navy via-[#003d66] to-uss-blue p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md mb-3 border border-white/20 shadow-inner">
            <GraduationCap className="w-8 h-8 text-uss-yellow" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Diplomado en Vinculación con el Medio</h2>
          <p className="text-xs text-sky-200 mt-1 uppercase tracking-wider font-semibold">
            Portal de Evidencias e Iniciativas para Trabajo Final
          </p>
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/10 text-white/90 text-xs px-2.5 py-1 rounded-full font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>USS</span>
          </div>
        </div>

        {/* Cuerpo del formulario */}
        <div className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-slate-900">Acceso Académico</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa con tu RUT para consultar la información de los programas e iniciativas que evaluarás.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="rut-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                RUT del Académico/a
              </label>
              <div className="relative">
                <input
                  id="rut-input"
                  type="text"
                  value={rutInput}
                  onChange={handleInputChange}
                  placeholder="Ej: 12.345.678-5"
                  maxLength={12}
                  className="w-full px-4 py-3 text-base font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-uss-blue focus:border-transparent transition placeholder:text-slate-400 bg-slate-50 focus:bg-white tracking-wide"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 mt-2.5 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-uss-navy hover:bg-uss-blue text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verificando acceso...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Ingresar al Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Acceso rápido para pruebas durante el desarrollo */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Acceso Rápido para Demostración / Pruebas
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {whitelist.slice(0, 4).map((user) => (
                <button
                  key={user.rut}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-uss-blue/60 hover:bg-sky-50/50 transition text-xs flex flex-col group cursor-pointer"
                >
                  <span className="font-semibold text-slate-800 group-hover:text-uss-blue truncate">
                    {user.nombre}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                    <span className="font-mono text-slate-600">{user.rut}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                      user.tipo === 'Interno' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {user.tipo}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Haz clic en cualquier usuario de prueba para ingresar instantáneamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
