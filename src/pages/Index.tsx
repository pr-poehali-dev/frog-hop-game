import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type LilyPad = {
  id: number;
  x: number;
  y: number;
  value: number;
  hasFly: boolean;
  used: boolean;
};

type Level = {
  id: number;
  lilypads: LilyPad[];
  startPos: number;
  finishPos: number;
  title: string;
};

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Уровень 1: Первый прыжок',
    startPos: 0,
    finishPos: 5,
    lilypads: [
      { id: 0, x: 50, y: 350, value: 0, hasFly: false, used: false },
      { id: 1, x: 150, y: 300, value: 5, hasFly: true, used: false },
      { id: 2, x: 250, y: 280, value: 3, hasFly: false, used: false },
      { id: 3, x: 180, y: 200, value: -2, hasFly: false, used: false },
      { id: 4, x: 300, y: 180, value: 4, hasFly: true, used: false },
      { id: 5, x: 380, y: 250, value: 0, hasFly: false, used: false },
    ],
  },
  {
    id: 2,
    title: 'Уровень 2: Опасные воды',
    startPos: 0,
    finishPos: 7,
    lilypads: [
      { id: 0, x: 40, y: 350, value: 0, hasFly: false, used: false },
      { id: 1, x: 120, y: 320, value: -3, hasFly: false, used: false },
      { id: 2, x: 200, y: 300, value: 6, hasFly: true, used: false },
      { id: 3, x: 150, y: 230, value: 4, hasFly: false, used: false },
      { id: 4, x: 280, y: 240, value: -5, hasFly: false, used: false },
      { id: 5, x: 230, y: 170, value: 7, hasFly: true, used: false },
      { id: 6, x: 350, y: 200, value: 3, hasFly: true, used: false },
      { id: 7, x: 390, y: 280, value: 0, hasFly: false, used: false },
    ],
  },
  {
    id: 3,
    title: 'Уровень 3: Мастер прыжков',
    startPos: 0,
    finishPos: 9,
    lilypads: [
      { id: 0, x: 50, y: 360, value: 0, hasFly: false, used: false },
      { id: 1, x: 130, y: 330, value: -4, hasFly: false, used: false },
      { id: 2, x: 100, y: 260, value: 8, hasFly: true, used: false },
      { id: 3, x: 190, y: 290, value: 5, hasFly: false, used: false },
      { id: 4, x: 260, y: 250, value: -6, hasFly: false, used: false },
      { id: 5, x: 200, y: 180, value: 7, hasFly: true, used: false },
      { id: 6, x: 310, y: 200, value: -3, hasFly: false, used: false },
      { id: 7, x: 350, y: 140, value: 6, hasFly: true, used: false },
      { id: 8, x: 400, y: 220, value: 4, hasFly: false, used: false },
      { id: 9, x: 420, y: 300, value: 0, hasFly: false, used: false },
    ],
  },
];

export default function Index() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [fliesCollected, setFliesCollected] = useState(0);
  const [frogPosition, setFrogPosition] = useState(0);
  const [lilypads, setLilypads] = useState<LilyPad[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [animatingPad, setAnimatingPad] = useState<number | null>(null);
  const [totalFlies, setTotalFlies] = useState(0);

  const currentLevel = LEVELS[currentLevelIndex];

  useEffect(() => {
    resetLevel();
  }, [currentLevelIndex]);

  const resetLevel = () => {
    const level = LEVELS[currentLevelIndex];
    setLilypads(level.lilypads.map(pad => ({ ...pad, used: false })));
    setFrogPosition(level.startPos);
    setScore(0);
    setFliesCollected(0);
    setGameState('playing');
    setTotalFlies(level.lilypads.filter(p => p.hasFly).length);
  };

  const handlePadClick = (padId: number) => {
    if (gameState !== 'playing') return;

    const pad = lilypads.find(p => p.id === padId);
    if (!pad || pad.used) return;

    if (padId === frogPosition) return;

    const currentPad = lilypads.find(p => p.id === frogPosition);
    if (!currentPad) return;

    const distance = Math.sqrt(
      Math.pow(pad.x - currentPad.x, 2) + Math.pow(pad.y - currentPad.y, 2)
    );

    if (distance > 150) return;

    setAnimatingPad(padId);

    setTimeout(() => {
      const newScore = score + pad.value;
      let newFlies = fliesCollected;

      if (pad.hasFly) {
        newFlies += 1;
        setFliesCollected(newFlies);
      }

      setScore(newScore);
      setFrogPosition(padId);

      const updatedPads = lilypads.map(p =>
        p.id === frogPosition ? { ...p, used: true } : p
      );
      setLilypads(updatedPads);

      setAnimatingPad(null);

      if (newScore < 0) {
        setGameState('lost');
      } else if (padId === currentLevel.finishPos && newFlies === totalFlies) {
        setGameState('won');
      }
    }, 600);
  };

  const nextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      setCurrentLevelIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8D5BA] to-[#6B9080] font-rubik overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-w-[500px]">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-secondary mb-2">🐸 Frog Hop</h1>
          <p className="text-secondary/80 text-sm">{currentLevel.title}</p>
        </div>

        <Card className="p-4 mb-4 bg-white/90 shadow-lg">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Coins" size={18} className="text-accent" />
              <span className="font-bold text-secondary">Очки: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪰</span>
              <span className="font-bold text-secondary">
                {fliesCollected}/{totalFlies}
              </span>
            </div>
          </div>
        </Card>

        <div className="relative bg-gradient-to-br from-[#4A7C59] to-[#2D5016] rounded-2xl shadow-2xl overflow-hidden h-[400px] mb-4">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: Math.random() * 30 + 10,
                  height: Math.random() * 30 + 10,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {lilypads.map((pad) => {
            const isCurrent = pad.id === frogPosition;
            const isFinish = pad.id === currentLevel.finishPos;
            const isAnimating = pad.id === animatingPad;

            return (
              <div
                key={pad.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  pad.used ? 'animate-sink pointer-events-none' : ''
                } ${isAnimating ? 'animate-hop' : ''}`}
                style={{
                  left: pad.x,
                  top: pad.y,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handlePadClick(pad.id)}
              >
                <div className="relative">
                  {isAnimating && (
                    <div className="absolute inset-0 bg-primary/50 rounded-full animate-ripple" />
                  )}

                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all ${
                      pad.value > 0
                        ? 'bg-primary text-white'
                        : pad.value < 0
                        ? 'bg-destructive text-white'
                        : 'bg-muted text-secondary'
                    } ${isCurrent ? 'ring-4 ring-accent' : ''} ${
                      isFinish ? 'ring-4 ring-yellow-400' : ''
                    }`}
                  >
                    {pad.value > 0 ? `+${pad.value}` : pad.value}
                  </div>

                  {pad.hasFly && !pad.used && (
                    <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                      🪰
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
                      🐸
                    </div>
                  )}

                  {isFinish && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full whitespace-nowrap">
                      ФИНИШ
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {gameState === 'won' && (
          <Card className="p-6 bg-primary text-white text-center animate-scale-in shadow-2xl">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-bold mb-2">Победа!</h2>
            <p className="mb-4">Итоговый счёт: {score} очков</p>
            <Button onClick={nextLevel} className="bg-white text-primary hover:bg-white/90">
              {currentLevelIndex < LEVELS.length - 1 ? 'Следующий уровень' : 'Играть снова'}
            </Button>
          </Card>
        )}

        {gameState === 'lost' && (
          <Card className="p-6 bg-destructive text-white text-center animate-scale-in shadow-2xl">
            <div className="text-5xl mb-3">💦</div>
            <h2 className="text-2xl font-bold mb-2">Лягушка утонула!</h2>
            <p className="mb-4">Очки ушли в минус</p>
            <Button onClick={resetLevel} className="bg-white text-destructive hover:bg-white/90">
              Попробовать снова
            </Button>
          </Card>
        )}

        {gameState === 'playing' && (
          <Card className="p-4 bg-white/90 shadow-lg">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={resetLevel} size="sm">
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Заново
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Собери всех мух и прыгни на финиш
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
