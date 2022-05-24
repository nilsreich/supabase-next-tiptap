import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Account({ session }) {
  const [mail, setMail] = useState('')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      setMail(user.email)
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
<div className="flex h-screen flex-col overflow-hidden bg-black text-xs text-neutral-300">
  <div className="flex flex-1">
    <div className="w-20 border-r border-neutral-800">
      <div className="bg-neutral-800 p-4 text-sm">BGY20a</div>
    </div>
    <div className="w-60 border-r border-neutral-800 p-4">Session</div>
    <div className="flex-1 p-6">Editor</div>
  </div>
  <div className="flex justify-between border-t border-neutral-800">
    <div className="bg-blue-600 px-2 py-1 text-neutral-50">{mail}</div>
    <button className="px-2 py-1" onClick={() => supabase.auth.signOut()}>logout</button>
  </div>
</div>

  )
}
