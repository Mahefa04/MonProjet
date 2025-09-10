import React, { useEffect, useState } from "react";
import { getDepenses, addDepense, type Depense } from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard: React.FC = () => {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");

  useEffect(() => {
    fetchDepenses();
  }, []);

  const fetchDepenses = async () => {
    const res = await getDepenses();
    setDepenses(res.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDepense({ nom, montant: parseFloat(montant) });
    setNom("");
    setMontant("");
    fetchDepenses();
  };

  const total = depenses.reduce((acc, d) => acc + d.montant, 0);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Tableau de bord</h1>
        <form className="depense-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Nom dépense"
            value={nom}
            onChange={e => setNom(e.target.value)}
          />
          <input
            type="number"
            placeholder="Montant"
            value={montant}
            onChange={e => setMontant(e.target.value)}
          />
          <button type="submit">Ajouter</button>
        </form>

        <ul className="depense-list">
          {depenses.map(d => (
            <li key={d.id}>
              <span>{d.nom}</span>
              <span>{d.montant}€</span>
            </li>
          ))}
        </ul>

        <h3>Total: {total}€</h3>
      </div>
    </div>
  );
};

export default Dashboard;
