import { NextResponse } from 'next/server';
import { supabase } from 'backend/utils/supabaseClient';

export async function GET() {
  const { data, error } = await supabase.from('users').select('username, email').limit(5);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, users: data });
}