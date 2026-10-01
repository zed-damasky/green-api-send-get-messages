import { useState } from "react";
import AuthForm from "./components/AuthForm";
import ChatWindow from "./components/ChatWindow";
import type { Credentials } from "./types";
import { Toaster } from "react-hot-toast";

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  const handleLogout = () => {
    setCredentials(null);
  };

  return (
    <>
      <Toaster position="top-center" />
      {!credentials ? (
        <AuthForm onLogin={setCredentials} />
      ) : (
        <ChatWindow credentials={credentials} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
