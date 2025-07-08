import { useEffect, useRef, useState } from "react";

const BlockGameWithoutOverlapCheck = () => {
  const [input, setInput] = useState("");
  const [play, setPlay] = useState(false);
  const [current, setCurrent] = useState(1);
  const [circles, setCircles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 100);
  };
  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const handlePlay = () => {
    const count = parseInt(input);
    if (!isNaN(count)) {
      setPlay(true);
      setGameOver(false);
      setCurrent(1);
      generateCircles(count);
      stopTimer();
      startTimer();
    }
  };
  const handleRestart = () => {
    handlePlay();
  };
  const handleChange = (e) => {
    const value = e.target.value;
    if (/^[1-9][0-9]*$/.test(value) || value === "") {
      setInput(value);
    }
  };
  const generateCircles = (count) => {
    const newCircles = [];
    const size = 50;

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * (500 - size));
      const y = Math.floor(Math.random() * (500 - size));
      newCircles.push({ x, y, order: i + 1 });
    }

    setCircles(newCircles);
  };

  const handleCircleClick = (order) => {
    if (gameOver) return;

    if (order === current) {
      // Mark as fading
      setCircles((prev) =>
        prev.map((c) => (c.order === order ? { ...c, fading: true } : c))
      );

      // After 3s, mark as faded
      setTimeout(() => {
        setCircles((prev) =>
          prev.map((c) => (c.order === order ? { ...c, faded: true } : c))
        );
      }, 3000);

      if (order === circles.length) {
        stopTimer();
        setTimeout(() => alert("You won!"), 100);
      } else {
        setCurrent(current + 1);
      }
    } else {
      setGameOver(true);
      stopTimer();
    }
  };

  return (
    <div className="w-11/12 h-full mx-auto !mt-20">
      <label htmlFor="numberOfCircle" className="mr-2">
        Points :
      </label>
      <input
        id="numberOfCircle"
        name="numberOfCircle"
        className="input"
        type="text"
        inputMode="numeric" // shows number keyboard on mobile
        placeholder="input number..."
        value={input}
        onChange={handleChange}
      />
      <div className="flex gap-4 mt-10">
        <button className="btn btn-success px-10" onClick={handlePlay}>
          Play
        </button>
        {play && (
          <button className="btn btn-warning px-10" onClick={handleRestart}>
            Restart
          </button>
        )}
      </div>
      {play && (
        <>
          <div className="text-center mt-6">
            {gameOver && (
              <p className="text-red-500 text-xl font-bold mb-2">Game Over</p>
            )}
            <p className="text-lg">Click: {current}</p>
            <p className="text-gray-700 mt-2">Time: {elapsed.toFixed(1)}s</p>
          </div>

          <div className="relative w-[500px] h-[500px] border mt-4 mx-auto overflow-hidden">
            {circles
              .slice()
              .sort((a, b) => b.order - a.order)
              .map((circle, index) => {
                if (circle.faded) return null;

                const timeLeft = Math.max(
                  0,
                  3 - (Date.now() - circle.startTime) / 1000
                ).toFixed(1);

                return (
                  <div
                    key={index}
                    className="absolute w-[50px] h-[50px] bg-blue-500 text-white flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-300"
                    style={{
                      left: circle.x,
                      top: circle.y,
                      zIndex: circles.length - circle.order + 1,
                      opacity: timeLeft <= 0 ? 0 : 1,
                    }}
                    onClick={() => handleCircleClick(circle.order)}
                  >
                    {circle.order}
                    <span className="absolute text-[10px] -bottom-3 text-white">
                      {timeLeft}s
                    </span>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default BlockGameWithoutOverlapCheck;
