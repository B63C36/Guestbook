import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await fetch("/api/entries");
    const data = await res.json();
    setEntries(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/entries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message }) });
    setName(""); setMessage(""); load();
  };

  const del = async (id) => {
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="container">
      <h1 className="title">Guestbook</h1>

      <div className="login-box">
        <strong>Login</strong><br/>
        <input placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>

      <form onSubmit={submit} className="form">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} rows="4" />
        <button type="submit" className="main-btn">Sign Guestbook</button>
      </form>

      {entries.length === 0 && <p className="empty">Empty</p>}

      {entries.map(e => (
        <div key={e.id} className="entry">
          <button onClick={() => del(e.id)} className="delete-btn">Delete</button>
          <div className="name" dangerouslySetInnerHTML={{ __html: e.name }} />
          <div className="message" dangerouslySetInnerHTML={{ __html: e.message }} />
          <small className="time">
            IP: {e.ip} | Browser: {e.user_agent} | {new Date(e.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default App;