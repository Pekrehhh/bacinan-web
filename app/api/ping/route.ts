import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  // Melakukan query ringan (HEAD only) tanpa mengambil beban payload data
  const { count, error } = await supabase
    .from('residents')
    .select('*', { count: 'exact', head: true });

  if (error) {
    return NextResponse.json(
      { status: 'error', error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'active',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
}
