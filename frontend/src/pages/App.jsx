import React, { useEffect, useState } from 'react'
import { getNews } from '../lib/api'
export default function App(){
  const [news,setNews]=useState([]); const [loading,setLoading]=useState(true); const [err,setErr]=useState('')
  useEffect(()=>{ getNews().then(setNews).catch(e=>setErr(e.message)).finally(()=>setLoading(false)) },[])
  return (<div style={{maxWidth:960,margin:'40px auto',fontFamily:'system-ui,sans-serif',padding:'0 16px'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h1>Hospital (Public)</h1>
      <nav><a href="/">Home</a> | <a href="/staff" onClick={e=>{e.preventDefault();alert('Staff portal handled in internal system')}}>Staff</a></nav>
    </header>
    <section>
      <h2>ข่าวประชาสัมพันธ์</h2>
      {loading && <p>Loading...</p>}
      {err && <p style={{color:'crimson'}}>Error: {err}</p>}
      <ul>{news.map(n=>(<li key={n.id}><strong>{n.title}</strong> — {n.published_at?.slice(0,10)}</li>))}</ul>
    </section>
  </div>)}
