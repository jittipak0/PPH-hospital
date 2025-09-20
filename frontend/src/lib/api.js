const base = import.meta.env.VITE_API_BASE_URL || window.location.origin
export async function getNews(){
  const r = await fetch(`${base}/api/news`)
  if(!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}
export async function createNews(token, payload){
  const r = await fetch(`${base}/api/staff/news`,{
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify(payload)
  })
  const data = await r.json(); if(!r.ok) throw new Error(data?.error || `HTTP ${r.status}`); return data
}
