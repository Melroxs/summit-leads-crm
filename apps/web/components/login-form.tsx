"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase-browser";

export function LoginForm() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Sign in with your Supabase user to load company-scoped CRM data.");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Signing you in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <form onSubmit={handleLogin} className="panel">
      <div className="panel-body">
        <div className="page-grid">
          <div className="info-card">
            <h4>Email</h4>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              style={{ width: "100%", background: "transparent", border: "none", color: "white", outline: "none" }}
            />
          </div>
          <div className="info-card">
            <h4>Password</h4>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              style={{ width: "100%", background: "transparent", border: "none", color: "white", outline: "none" }}
            />
          </div>
          <button className="link-button" type="submit" disabled={loading}>
            {loading ? "Signing In" : "Sign In"}
          </button>
          <div className="callout">{message}</div>
        </div>
      </div>
    </form>
  );
}

