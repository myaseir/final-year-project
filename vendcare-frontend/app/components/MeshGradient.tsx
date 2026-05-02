'use client';

import React from 'react';

export default function MeshGradient() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#FDF8F8]">
      {/* 
          Static Soft Gradient 
          Since we aren't using animations, we can use a simple radial gradient 
          to keep that "luxurious" depth without the performance hit.
      */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `radial-gradient(circle at 20% 20%, #F3C5C5 0%, transparent 50%), 
                       radial-gradient(circle at 80% 80%, #E29595 0%, transparent 50%)`,
          opacity: 0.4,
          filter: 'blur(60px)'
        }}
      />

      {/* Subtle Grainy Texture Overlay to keep it from looking flat */}
     
    </div>
  );
}