import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qolzretrsvhtqpyzvvtt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbHpyZXRyc3ZodHFweXp2dnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTc3MzUsImV4cCI6MjA0NzkzMzczNX0.rD8jOA1k9LSVZkb-RvtfKQ8lmJhZbcCJdS2Kq67GAOE';

export const supabase = createClient(supabaseUrl, supabaseKey);