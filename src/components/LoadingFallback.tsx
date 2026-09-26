import React from 'react';

/**
 * LoadingFallback Component
 * 
 * A loading fallback component used with React.Suspense for lazy-loaded routes.
 * Displays a centered loading spinner with Portuguese text matching the application's
 * PONTAL Carapitangui beach club theme.
 */
export const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="bg-card px-8 py-6 rounded-2xl shadow-lg border border-border">
        <div className="flex items-center gap-4">
          {/* Spinning loader */}
          <div className="w-7 h-7 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          
          {/* Loading text */}
          <div>
            <p className="text-foreground font-bold text-sm">Carregando...</p>
            <p className="text-muted-foreground text-xs mt-0.5">Preparando o cardápio digital</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
