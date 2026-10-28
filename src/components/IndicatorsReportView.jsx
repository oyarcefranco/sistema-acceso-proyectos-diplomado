import React from 'react';
import { 
  BarChart3, 
  Building2, 
  Users, 
  GraduationCap, 
  Download, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

export default function IndicatorsReportView({ pth }) {
  // Calcular métricas agrupadas por Línea de Acción
  const agrupadoPorLinea = pth.lineasDeAccion.map((linea) => {
    const proyectosLinea = pth.proyectos.filter((p) => p.lineaAccion === linea);
    const orgs = proyectosLinea.reduce((acc, p) => acc + p.indicadores.organizaciones, 0);
    const est = proyectosLinea.reduce((acc, p) => acc + p.indicadores.estudiantes, 0);
    const acad = proyectosLinea.reduce((acc, p) => acc + p.indicadores.academicos, 0);
    return {
      linea,
      cantidadProyectos: proyectosLinea.length,
      organizaciones: orgs,
      estudiantes: est,
      academicos: acad,
    };
  });

  const exportarCSV = () => {
    let csv = 'Código,Año,Línea de Acción,Proyecto,Sede,N° Organizaciones,N° Estudiantes,N° Académicos\n';
    pth.proyectos.forEach((p) => {
      csv += `"${p.codigo}","${p.ano}","${p.lineaAccion}","${p.nombre}","${p.sede}",${p.indicadores.organizaciones},${p.indicadores.estudiantes},${p.indicadores.academicos}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Indicadores_${pth.sigla}_2024_2025.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Resumen Superior */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-uss-blue" />
              Consolidado de Indicadores Oficiales (Gestión Cristóbal)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Métricas de impacto y cobertura por proyecto y línea de acción correspondientes a los períodos 2024 y 2025.
            </p>
          </div>
          <button
            onClick={exportarCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Indicadores (CSV)</span>
          </button>
        </div>

        {/* Resumen por Línea de Acción */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agrupadoPorLinea.map((item) => (
            <div key={item.linea} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-uss-navy line-clamp-1 mb-2 block">
                {item.linea}
              </span>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="bg-white p-2 rounded-lg border border-slate-200/50">
                  <div className="text-sm font-extrabold text-slate-900">{item.organizaciones}</div>
                  <div className="text-[10px] text-slate-500">Orgs</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/50">
                  <div className="text-sm font-extrabold text-emerald-600">{item.estudiantes}</div>
                  <div className="text-[10px] text-slate-500">Estudiantes</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/50">
                  <div className="text-sm font-extrabold text-uss-blue">{item.academicos}</div>
                  <div className="text-[10px] text-slate-500">Académicos</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla detallada de indicadores por proyecto */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Detalle de Indicadores por Proyecto
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            Total {pth.proyectos.length} proyectos
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                <th className="py-2.5 px-4">Código</th>
                <th className="py-2.5 px-4">Año</th>
                <th className="py-2.5 px-4">Línea de Acción</th>
                <th className="py-2.5 px-4">Proyecto</th>
                <th className="py-2.5 px-3 text-center">N° Orgs</th>
                <th className="py-2.5 px-3 text-center">N° Estudiantes</th>
                <th className="py-2.5 px-3 text-center">N° Académicos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pth.proyectos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.codigo}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{p.ano}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{p.lineaAccion}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">{p.nombre}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">{p.indicadores.organizaciones}</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700">{p.indicadores.estudiantes}</td>
                  <td className="py-3 px-3 text-center font-bold text-uss-blue">{p.indicadores.academicos}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/80 font-bold text-slate-900 border-t border-slate-200">
                <td colSpan={4} className="py-3 px-4 text-right">TOTALES DEL PROGRAMA:</td>
                <td className="py-3 px-3 text-center text-slate-900">{pth.totales.organizaciones}</td>
                <td className="py-3 px-3 text-center text-emerald-700">{pth.totales.estudiantes}</td>
                <td className="py-3 px-3 text-center text-uss-blue">{pth.totales.academicos}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
