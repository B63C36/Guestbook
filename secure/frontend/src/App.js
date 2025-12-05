import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  const load = async () => {
    const res = await fetch("/api/entries");
    const data = await res.json();
    setEntries(data);
  };

  useEffect(() => { load(); }, []);

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (json.success) {
      setLoggedIn(true);
      setLoginMsg("Logged in as user");
      setUsername(""); setPassword("");
    } else {
      setLoginMsg("Wrong credentials - try user / 123secure");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, message })
    });
    setName(""); setMessage(""); load();
  };

  const del = async (id) => {
    await fetch(`/api/entries/${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  return (
    <div className="container">
      <h1 className="title">Guestbook</h1>

      <div className="login-box">
        {loggedIn ? (
          <strong style={{color: "#006400"}}>Logged in as user</strong>
        ) : (
          <>
            <strong>Login Required</strong><br/>
            <form onSubmit={login} style={{marginTop: "10px"}}>
              <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
            <small style={{color: "#c00"}}>{loginMsg}</small>
          </>
        )}
      </div>

      {loggedIn && (
        <form onSubmit={submit} className="form">
          <input required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <textarea required placeholder="Your message" value={message} onChange={e => setMessage(e.target.value)} rows="4" />
          <button type="submit" className="main-btn">Sign Guestbook</button>
        </form>
      )}

      {entries.length === 0 && <p className="empty">Empty</p>}

      {entries.map(e => (
        <div key={e.id} className="entry">
          {loggedIn && <button onClick={() => del(e.id)} className="delete-btn">Delete</button>}
          <div className="name">{e.name}</div>
          <div className="message">{e.message}</div>
          <small className="time">{new Date(e.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default App;