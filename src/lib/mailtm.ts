export interface Message {
  id: string;
  from: { address: string };
  subject: string;
}

export async function gerarContaTemporaria() {
  const dominio = "dcpa.net";
  const username = "user" + Math.floor(Math.random() * 100000);
  const address = username + "@" + dominio;

  const res = await fetch("https://api.mail.tm/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password: "123456" })
  });
  const conta = await res.json();

  const login = await fetch("https://api.mail.tm/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password: "123456" })
  });
  const tokenData = await login.json();

  return { address, token: tokenData.token };
}

export async function listarMensagens(token: string) {
  const res = await fetch("https://api.mail.tm/messages", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data["hydra:member"] as Message[];
}
