import React, { useState } from "react";
import { loginUser, type UserLogin } from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginData: UserLogin = { email, password };
    try {
      const res = await loginUser(loginData);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      alert("Email ou mot de passe incorrect");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
