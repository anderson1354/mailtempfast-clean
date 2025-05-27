import React, { useEffect, useState } from "react";
import { gerarContaTemporaria, listarMensagens, Message } from "../lib/mailtm";

export default function Inbox() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [expiraEm, setExpiraEm] = useState(3600);

  useEffect(() => {
    async function iniciar() {
      const conta = await gerarContaTemporaria();
      setEmail(conta.address);
      setToken(conta.token);
    }
    iniciar();
  }, []);

  useEffect(() => {
    if (!token) return;
    const intervalo = setInterval(async () => {
      const msgs = await listarMensagens(token);
      setMensagens(msgs);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiraEm((e) => (e > 0 ? e - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutos = String(Math.floor(expiraEm / 60)).padStart(2, "0");
  const segundos = String(expiraEm % 60).padStart(2, "0");

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      <div style={{ background: "#2563eb", padding: 20, borderRadius: 8, color: "white" }}>
        <h2>📧 Seu E-mail Temporário <span style={{ fontWeight: 300 }}>@dcpa.net</span></h2>
        <p style={{ fontSize: "1.5rem", wordBreak: "break-all", margin: "10px 0" }}>{email}</p>
        <p>⏳ Expira em {minutos}:{segundos}</p>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => navigator.clipboard.writeText(email)} style={{ marginRight: 10 }}>
            📋 Copiar E-mail
          </button>
          <button onClick={() => window.location.reload()}>🔄 Novo E-mail</button>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>📥 Caixa de Entrada</h3>
        {mensagens.length === 0 ? (
          <p>Carregando mensagens...</p>
        ) : (
          <ul>
            {mensagens.map((msg) => (
              <li key={msg.id} style={{ marginBottom: 10 }}>
                <strong>{msg.from.address}</strong><br />
                Assunto: {msg.subject}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 40, textAlign: "center", color: "#888", fontSize: "0.9rem" }}>
        Área para anúncio do Google AdSense
      </div>
    </div>
  );
}
