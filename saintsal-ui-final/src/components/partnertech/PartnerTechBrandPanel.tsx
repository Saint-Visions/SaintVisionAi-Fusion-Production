
'use client';
import React from 'react';
import { Badge } from "@/components/ui/badge";

export function PartnerTechBrandPanel() {
  return (
    <div className="bg-black rounded-xl shadow-xl p-6 text-center text-white">
      <h2 className="text-3xl font-bold text-gradient-gold mb-2">PartnerTech.ai</h2>
      <p className="text-sm text-muted-foreground mb-4">
        The only CRM-Intelligent SaaS powered by SAINTSAL™ & protected under U.S. Patent No. 10,290,222.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge>AI CRM Routing</Badge>
        <Badge>Intent Triggers</Badge>
        <Badge>Multi-Tenant SaaS</Badge>
        <Badge>Azure + Twilio Ready</Badge>
      </div>
    </div>
  );
}
