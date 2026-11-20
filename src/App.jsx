import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PTHSelector from './components/PTHSelector';
import InitiativeDetail from './components/InitiativeDetail';
import ContinuityProjectDetail from './components/ContinuityProjectDetail';
import PDFModalViewer from './components/PDFModalViewer';
import iniciativasData from './data/iniciativas.json';
import proyectosContinuidadData from './data/proyectosContinuidad.json';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const sessionUser = sessionStorage.getItem('vcm_diplomado_user');
      if (sessionUser) return JSON.parse(sessionUser);
      const localUser = localStorage.getItem('vcm_diplomado_user');
      if (localUser) return JSON.parse(localUser);
    } catch (e) {
      console.warn('Error reading stored user session:', e);
    }
    return null;
  });

  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('vcm_diplomado_user', JSON.stringify(user));
      localStorage.setItem('vcm_diplomado_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Error saving user session:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedInitiative(null);
    setActiveDocument(null);
    try {
      sessionStorage.removeItem('vcm_diplomado_user');
      localStorage.removeItem('vcm_diplomado_user');
    } catch (e) {
      console.warn('Error removing user session:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Modal de Acceso por RUT si no hay usuario autenticado */}
      {!currentUser && (
        <LoginModal onLoginSuccess={handleLoginSuccess} />
      )}

      {/* Header institucional */}
      {currentUser && (
        <Header
          user={currentUser}
          currentInitiative={selectedInitiative}
          onSelectInitiative={setSelectedInitiative}
          onLogout={handleLogout}
        />
      )}

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser && !selectedInitiative && (
          <PTHSelector
            iniciativas={iniciativasData}
            proyectosContinuidad={proyectosContinuidadData}
            onSelectInitiative={setSelectedInitiative}
            onSelectContinuityProject={setSelectedInitiative}
            user={currentUser}
          />
        )}

        {/* Vista Detalle de Proyecto de Continuidad */}
        {currentUser && selectedInitiative && selectedInitiative.tipo === 'Proyecto de Continuidad' && (
          <ContinuityProjectDetail
            project={selectedInitiative}
            onBack={() => setSelectedInitiative(null)}
            onOpenDocument={setActiveDocument}
          />
        )}

        {/* Vista Detalle de Programa Territorial Hito (PTH) */}
        {currentUser && selectedInitiative && selectedInitiative.tipo !== 'Proyecto de Continuidad' && (
          <InitiativeDetail
            pth={selectedInitiative}
            onBack={() => setSelectedInitiative(null)}
            onOpenDocument={setActiveDocument}
          />
        )}
      </main>

      {/* Visor de PDF Integrado */}
      {activeDocument && (
        <PDFModalViewer
          documentData={activeDocument}
          onClose={() => setActiveDocument(null)}
        />
      )}

      {/* Footer Institucional */}
      {currentUser && (
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-uss-navy">Universidad San Sebastián</span>
              <span>·</span>
              <span>Vicerrectoría de Vinculación con el Medio</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Diplomado en Vinculación con el Medio · Sistema de Evidencias para Evaluación Final
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
