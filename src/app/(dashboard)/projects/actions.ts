'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fetchProjectsWithStats() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Fetch projects and join with scripts to get the count
  const { data, error } = await supabase
    .from('projects')
    .select('*, scripts(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  // Format the output for the frontend
  return data.map((project: any) => ({
    ...project,
    scriptCount: project.scripts[0]?.count || 0,
  }))
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  if (!name || name.trim() === '') {
    return { error: 'Project name is required' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('projects')
    .insert({ user_id: user.id, name: name.trim() })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  return { success: true }
}

export async function renameProject(id: string, newName: string) {
  if (!newName || newName.trim() === '') {
    return { error: 'Project name is required' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('projects')
    .update({ name: newName.trim(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath('/dashboard')
  return { success: true }
}
