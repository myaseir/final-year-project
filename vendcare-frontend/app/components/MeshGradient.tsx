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
  background: `radial-gradient(circle at 20% 20%, #A7C7D8 0%, transparent 60%), 
               radial-gradient(circle at 80% 80%, #f8f8f8 0%, transparent 60%)`,
  opacity: 0.6,
  filter: 'blur(80px)'
}}
      />

      {/* Subtle Grainy Texture Overlay to keep it from looking flat */}
     
    </div>
  );
}