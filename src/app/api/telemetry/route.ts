import { NextResponse } from 'next/server';
import { PROJECTS } from '@/data/portfolio';

export const runtime = 'nodejs';

export async function GET() {
  const dubaiTime = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return NextResponse.json({
    status: 'HEALTHY',
    region: 'Dubai, UAE (Asia/Dubai)',
    runtime: `Node.js ${process.version}`,
    dubaiTime: `${dubaiTime} GST`,
    uptimeSeconds: Math.round(process.uptime()),
    metrics: {
      yearsLeadership: 9,
      ebmsUsers: 105,
      sisterCompanies: 9,
      toolingReductionPercent: 80,
      productionSystems: PROJECTS.length,
    },
  });
}
