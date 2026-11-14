"use client";
import { useState, type FormEvent } from "react";
import { Gem, LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();setBusy(true);setError("");
    try {
      const response=await fetch("/api/auth/login",{
        method:"POST",credentials:"same-origin",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password}),
      });
      const data=await response.json();
      if (!response.ok) throw new Error(
        data.error==="OWNER_LOGIN_NOT_CONFIGURED"?"Owner login is not configured on this Headquarters deployment.":
        response.status===429?"Too many attempts. Please try again later.":"Invalid credentials or login temporarily unavailable."
      );
      window.location.replace("/");
    }catch(e){setError(e instanceof Error?e.message:"Login failed.");setPassword("");}
    finally{setBusy(false);}
  };
  return <main className="login-page">
    <section className="login-shell" aria-label="Owner login to independent Prasanth Jewellers AI Headquarters">
      <div className="login-brand"><Gem size={32}/><div><strong>PRASANTH</strong><span>AI HEADQUARTERS</span></div></div>
      <div className="login-eyebrow"><ShieldCheck size={15}/> PRIVATE OWNER ACCESS</div>
      <h1>Command your headquarters.</h1>
      <p>Evidence-backed wholesale opportunities, independent product references and owner-controlled approvals. The store stays separate.</p>
      {error&&<div className="login-error" role="alert">{error}</div>}
      <form onSubmit={submit} className="login-form">
        <label htmlFor="hq-username">Owner username</label>
        <input id="hq-username" name="username" autoComplete="username" required maxLength={100}
          value={username} onChange={e=>setUsername(e.target.value)}/>
        <label htmlFor="hq-password">Password</label>
        <input id="hq-password" name="password" type="password" autoComplete="current-password" required maxLength={300}
          value={password} onChange={e=>setPassword(e.target.value)}/>
        <button disabled={busy} type="submit"><LockKeyhole size={17}/>{busy?"Authenticating…":"Enter headquarters"}</button>
      </form>
      <footer>Owner session expires after eight hours. No SPLCART credentials are used.</footer>
    </section>
  </main>;
}
