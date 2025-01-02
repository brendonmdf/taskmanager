'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  const phrases = [
    "Organize e gerencie seus processos com facilidade.",
    "Transforme a gestão do seu trabalho em algo mais ágil e intuitivo.",
    
  ];

  const typeWriterEffect = (text: string, index: number) => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      setDisplayText((prev) => prev + text[charIndex]);
      charIndex++;
      if (charIndex === text.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          eraseText(text);
        }, 1500); // Delay antes de apagar o texto
      }
    }, 100); // Velocidade de digitação
  };

  const eraseText = (text: string) => {
    let charIndex = text.length;
    const erasingInterval = setInterval(() => {
      setDisplayText((prev) => prev.slice(0, charIndex - 1));
      charIndex--;
      if (charIndex === 0) {
        clearInterval(erasingInterval);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % phrases.length); // Passa para a próxima frase
        }, 500); // Delay antes de começar a digitar a próxima frase
      }
    }, 50); // Velocidade de apagamento
  };

  useEffect(() => {
    typeWriterEffect(phrases[index], index);
  }, [index]);

  const handleLoginClick = () => {
    router.push('/login'); // Certifique-se de que a página de login existe em app/login.tsx
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-gradient-to-r from-black via-blue-900 to-blue-500 text-white overflow-hidden">
      {/* Estrelas animadas ao fundo */}
      <div className="absolute inset-0 bg-transparent z-0">
        <div className="stars"></div>
      </div>

      {/* Título no canto superior esquerdo */}
      <div className="absolute top-4 left-4 text-2xl font-bold z-10">
        Task Manager.
      </div>

      {/* Texto central */}
      <h1 className="text-4xl font-bold mb-4 z-10">{displayText}</h1>

      <p className="text-lg mb-6 z-10">Explore as funcionalidades e faça login para continuar.</p>
      <Button onClick={handleLoginClick} className="px-6 py-3 text-lg font-semibold rounded-md bg-white text-blue-500 hover:bg-gray-100 transition duration-300 z-10">
        Login
      </Button>

      <style jsx>{`
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          pointer-events: none;
          z-index: -1;
        }
        .stars::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"%3E%3Ccircle cx="50" cy="50" r="2" fill="%23fff" /%3E%3Ccircle cx="200" cy="100" r="2" fill="%23fff" /%3E%3Ccircle cx="350" cy="150" r="2" fill="%23fff" /%3E%3Ccircle cx="500" cy="200" r="2" fill="%23fff" /%3E%3Ccircle cx="650" cy="250" r="2" fill="%23fff" /%3E%3Ccircle cx="700" cy="300" r="2" fill="%23fff" /%3E%3Ccircle cx="150" cy="350" r="2" fill="%23fff" /%3E%3Ccircle cx="300" cy="400" r="2" fill="%23fff" /%3E%3Ccircle cx="450" cy="450" r="2" fill="%23fff" /%3E%3Ccircle cx="600" cy="500" r="2" fill="%23fff" /%3E%3Ccircle cx="50" cy="550" r="2" fill="%23fff" /%3E%3Ccircle cx="200" cy="600" r="2" fill="%23fff" /%3E%3Ccircle cx="350" cy="650" r="2" fill="%23fff" /%3E%3Ccircle cx="500" cy="700" r="2" fill="%23fff" /%3E%3Ccircle cx="650" cy="750" r="2" fill="%23fff" /%3E%3Ccircle cx="700" cy="800" r="2" fill="%23fff" /%3E%3C/svg%3E');
          animation: moveStars 50s linear infinite;
          background-size: 150% 150%;
        }

        @keyframes moveStars {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;