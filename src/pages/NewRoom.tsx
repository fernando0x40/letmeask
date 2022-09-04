import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import "../styles/auth.scss";
import { Button } from "../components/Button";
import { database, firebaseRef, firebasePush } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

export function NewRoom() {
  const { user } = useAuth();

  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = firebaseRef(database, "rooms");

    const firebaseRoom = await firebasePush(roomRef, {
      title: newRoom,
      authorId: user?.id,
    });
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
