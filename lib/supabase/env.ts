const browserEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

const serverEnv = {
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

export function hasSupabaseBrowserEnv() {
  return Boolean(browserEnv.url && browserEnv.anonKey)
}

export function hasSupabaseServerEnv() {
  return Boolean(browserEnv.url && browserEnv.anonKey && serverEnv.serviceRoleKey)
}

export function getSupabaseBrowserEnv() {
  if (!hasSupabaseBrowserEnv()) {
    throw new Error("Missing Supabase browser environment variables.")
  }

  return {
    url: browserEnv.url!,
    anonKey: browserEnv.anonKey!,
  }
}

export function getSupabaseServerEnv() {
  if (!hasSupabaseServerEnv()) {
    throw new Error("Missing Supabase server environment variables.")
  }

  return {
    ...getSupabaseBrowserEnv(),
    serviceRoleKey: serverEnv.serviceRoleKey!,
  }
}
