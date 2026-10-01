import { useState } from "react";
import {
  Button,
  CHAT_PATTERN_CONFIG,
  Input,
  SeamlessPatternBackground,
} from "./ui";
import type { Credentials } from "../types";

interface AuthFormProps {
  onLogin: (creds: Credentials) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [idInstance, setIdInstance] = useState("");
  const [apiToken, setApiToken] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin({ idInstance, apiTokenInstance: apiToken });
  };

  const isFormValid =
    idInstance.trim().length > 0 && apiToken.trim().length > 0;

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <SeamlessPatternBackground
        gradient={CHAT_PATTERN_CONFIG.gradient}
        tileSize={CHAT_PATTERN_CONFIG.tileSize}
        svgs={CHAT_PATTERN_CONFIG.svgs}
        className="pointer-events-none"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-2xl shadow-xl w-96 space-y-4 z-0"
      >
        <h2 className="text-2xl font-bold text-center text-foreground">
          GREEN-API MAX
        </h2>
        <p className="text-sm text-center text-muted-foreground -mt-2 mb-4">
          Введите данные вашего инстанса
        </p>

        <Input
          placeholder="idInstance (например, 1101000000)"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          required
        />

        <Input
          placeholder="apiTokenInstance"
          type="password"
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={!isFormValid}>
          Войти
        </Button>
      </form>
    </div>
  );
}
