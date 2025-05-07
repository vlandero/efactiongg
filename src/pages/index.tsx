import { Button } from "@/components/Button";
import { ModalSignup } from "@/components/ModalSignup";
import { useState } from "react";

export default function Home() {
  const [modalSignupOpen, setModalSignupOpen] = useState(false);

  return (
    <div className="scroll-smooth">
      <section className="h-[50vh] bg-primary text-white flex items-center justify-center flex-col text-center px-4">
        <h1 className="text-4xl font-bold mb-4">All your teams, one place.</h1>
        <p className="text-lg max-w-xl mb-6">
          Manage your entire organization from a single dashboard—no chaos, no
          confusion.
        </p>
        <Button onClick={() => setModalSignupOpen(true)}>
          Get Started for free!
        </Button>
      </section>

      <section className="h-[50vh] secondary-gradient text-black flex items-center justify-center flex-col text-center px-4">
        <h2 className="text-4xl font-bold mb-4">Built for growth.</h2>
        <p className="text-lg max-w-xl mb-6">
          Whether you’re a small squad or a multi-game empire, scale easily with
          tools made to grow with you.
        </p>
      </section>

      <section className="h-[50vh] bg-primary text-white flex items-center justify-center flex-col text-center px-4">
        <h2 className="text-4xl font-bold mb-4">
          Let players find their tribe.
        </h2>
        <p className="text-lg max-w-xl mb-6">
          Create a public space where gamers can join, connect, and build their
          own teams inside your world.
        </p>
      </section>

      {modalSignupOpen && (
        <ModalSignup onClose={() => setModalSignupOpen(false)} />
      )}
    </div>
  );
}
