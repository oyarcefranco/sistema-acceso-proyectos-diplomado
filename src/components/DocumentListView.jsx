import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  GraduationCap,
  Filter
} from 'lucide-react';

export default function DocumentListView({ pth, docTypeKey, title, docLabel, onOpenDocument }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('Todos');

  // Filtrar documentos
  const documentItems = useMemo(() => {
    return pth.proyectos
      .map((proyecto) => {
        const doc = proyecto.documentos[docTypeKey];
        return {
          proyecto,
          doc,
        };
      })
      .filter(({ proyecto, doc }) => {
        if (yearFilter !== 'Todos' && proyecto.ano.toString() !== yearFilter) {
          return false;
        }
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const matchName = proyecto.nombre.toLowerCase().includes(term);
          const matchCode = proyecto.codigo.toLowerCase().includes(term);
          if (!matchName && !matchCode) return false;
        }
        return true;
      });
  }, [pth.proyectos, docTypeKey, yearFilter, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código o nombre de proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-uss-blue"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {['Todos', '2024', '2025'].map((yr) => (
              <button
                key={yr}
                onClick={() => setYearFilter(yr)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  yearFilter === yr
                    ? 'bg-white text-uss-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {documentItems.map(({ proyecto, doc }) => {
          return (
            <div
              key={proyecto.id}
              className="p-4 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  doc.disponible ? 'bg-sky-50 text-uss-blue border border-sky-100' : 'bg-slate-100 text-slate-400'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {proyecto.codigo}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {proyecto.ano}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {proyecto.lineaAccion}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {proyecto.nombre}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span>Sede: {proyecto.sede}</span>
                    <span>•</span>
                    <span>{doc.disponible ? `${doc.tamano} · ${doc.fecha}` : 'Sin archivo disponible'}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                {doc.disponible ? (
                  <>
                    <button
                      onClick={() => onOpenDocument({
                        tipo: title,
                        proyecto,
                        pth,
                        archivo: doc.archivo,
                        tamano: doc.tamano,
                        fecha: doc.fecha
                      })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-uss-navy hover:bg-uss-blue text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Documento</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
                    {doc.estado}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
