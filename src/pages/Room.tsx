import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import {
  database,
  firebasePush,
  firebaseRef,
  firebaseValue,
} from "../services/firebase";

import "../styles/room.scss";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function Room() {
  const { user } = useAuth();
  const { id } = useParams();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");

  if (!id) {
    throw new Error("Unexpected error: Missing room id!");
  }

  useEffect(() => {
    const roomRef = firebaseRef(database, `rooms/${id}`);

    firebaseValue(
      roomRef,
      (snapshot) => {
        // console.log(snapshot.val());
        const firebaseQuestions: FirebaseQuestions =
          snapshot.val().questions ?? {};
        const parsedQuestions = Object.entries(firebaseQuestions).map(
          ([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
            };
          }
        );
        // console.log(parsedQuestions);

        setTitle(snapshot.val().title);
        setQuestions(parsedQuestions);
      },
      {
        onlyOnce: true,
      }
    );
  }, [id]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Unexpected error: User not authenticated!");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const questIonRef = firebaseRef(database, `rooms/${id}/questions`);
    await firebasePush(questIonRef, question);

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={id} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            <span>
              {user ? (
                <div className="user-info">
                  <img
                    src={user.avatar}
                    referrerPolicy="no-referrer"
                    alt={user.name}
                  />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span>
                  Para enviar uma pergunta, <button>faça seu login</button>.
                </span>
              )}
            </span>
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
