'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ScriptFilters = {
  query?: string;
  platform?: string;
  niche?: string;
  project_id?: string;
  sort?: 'newest' | 'oldest';
}

export async function fetchScripts(filters?: ScriptFilters) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let queryBuilder = supabase
    .from('scripts')
    .select('*')
    .eq('user_id', user.id)

  // Apply filters
  if (filters?.platform && filters.platform !== 'all') {
    queryBuilder = queryBuilder.eq('platform', filters.platform)
  }

  if (filters?.niche && filters.niche !== 'all') {
    queryBuilder = queryBuilder.eq('niche', filters.niche)
  }

  if (filters?.project_id) {
    queryBuilder = queryBuilder.eq('project_id', filters.project_id)
  }

  // Apply search
  if (filters?.query) {
    // Search in topic or hook
    queryBuilder = queryBuilder.or(`topic.ilike.%${filters.query}%,hook.ilike.%${filters.query}%`)
  }

  // Apply sorting
  if (filters?.sort === 'oldest') {
    queryBuilder = queryBuilder.order('created_at', { ascending: true })
  } else {
    queryBuilder = queryBuilder.order('created_at', { ascending: false }) // Default to newest
  }

  const { data, error } = await queryBuilder

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteScript(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/projects')
  return { success: true }
}

export async function moveScriptToProject(scriptId: string, projectId: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('scripts')
    .update({ project_id: projectId })
    .eq('id', scriptId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/projects')
  return { success: true }
}
