
'use client';
import React from 'react';

export default function CRMPage() {
  return (
    <iframe
      src={process.env.NEXT_PUBLIC_GHL_URL || 'https://app.gohighlevel.com'}
      className="w-full h-screen border-none"
      title="CRM Portal"
    />
  );
}
