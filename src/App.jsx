import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PTHSelector from './components/PTHSelector';
import InitiativeDetail from './components/InitiativeDetail';
import PDFModalViewer from './components/PDFModalViewer';
import iniciativasData from './data/iniciativas.json';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vcm_diplomado_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('vcm_diplomado_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedInitiative(null);
    setActiveDocument(null);
    localStorage.removeItem('vcm_diplomado_user');
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
            onSelectInitiative={setSelectedInitiative}
            user={currentUser}
          />
        )}

        {currentUser && selectedInitiative && (
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
