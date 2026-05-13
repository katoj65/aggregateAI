import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://hbuoyoqaeeslrzwldsaw.supabase.co'

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidW95b3FhZWVzbHJ6d2xkc2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzkxODgsImV4cCI6MjA5MzkxNTE4OH0.8aCcCMkgjMaA6FrSRVjJhQiEODRPvjIHI1GYNvJhKdU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

class Database {
  constructor() {
    this.client = supabase
  }

  getClient() {
    return this.client
  }
}

const database = new Database()

export default database
