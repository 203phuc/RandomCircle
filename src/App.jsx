import { useEffect, useState } from "react";

const BlockGameWithoutOverlapCheck = () => {
  const [input, setInput] = useState("");
  const [play, setPlay] = useState(false);
  const [current, setCurrent] = useState(1);
  const [circles, setCircles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [allClear, setAllClear] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalTick, setIntervalTick] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^[1-9][0-9]*$/.test(value) || value === "") {
      setInput(value);
    }
  };

  const handlePlay = () => {
    const count = parseInt(input);
    if (!isNaN(count)) {
      generateCircles(count);
      setPlay(true);
      const now = Date.now();
      setStartTime(now);
      const id = setInterval(() => {
        setElapsedTime(Date.now() - now);
      }, 100);
      setIntervalTick(id);
    }
  };

  const handleRestart = () => {
    if (!disabled) {
      handlePlay();
    }
  };

  const generateCircles = (count) => {
    const size = 50;
    const newCircles = [];

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * (500 - size));
      const y = Math.floor(Math.random() * (500 - size));
      newCircles.push({ x, y, order: i + 1, clickedAt: null });
    }

    setCircles(newCircles);
    setCurrent(1);
    setGameOver(false);
    setAllClear(false);
    setElapsedTime(0);
    clearInterval(intervalTick);
    setIntervalTick(null);
  };

  const handleCircleClick = (order) => {
    if (!play || gameOver || allClear) return;

    if (order === current) {
      const now = Date.now();
      setCircles((prev) =>
        prev.map((c) => (c.order === order ? { ...c, clickedAt: now } : c))
      );

      if (order === circles.length) {
        setDisabled(true);
        setTimeout(() => {
          if (!gameOver && !allClear && current === circles.length) {
            setAllClear(true);
            clearInterval(intervalTick);
          }
          setDisabled(false);
        }, 3000);
      } else {
        setCurrent(current + 1);
      }
    } else {
      clearInterval(intervalTick);
      setGameOver(true);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalTick);
  }, [intervalTick]);

  return (
    <div className="w-11/12 h-full mx-auto !mt-20">
      {gameOver && (
        <h2 className="text-red-500 text-xl font-bold mb-4">Game Over</h2>
      )}

      {allClear && (
        <h2 className="text-green-500 text-xl font-bold mb-4">All Clear!</h2>
      )}

      {!gameOver && !allClear && (
        <>
          <h2 className="text-black text-xl font-bold mb-4">Let's play</h2>
          <p className="mt-2 text-lg">
            Time: {(elapsedTime / 1000).toFixed(2)}s
          </p>
        </>
      )}

      <label htmlFor="numberOfCircle" className="mr-2">
        Points :
      </label>
      <input
        id="numberOfCircle"
        name="numberOfCircle"
        className="input"
        type="text"
        inputMode="numeric"
        placeholder="input number..."
        value={input}
        onChange={handleChange}
      />
      <div className="flex gap-4 mt-10">
        {play ? (
          <button className="btn btn-warning px-10" onClick={handleRestart}>
            Restart
          </button>
        ) : (
          <button className="btn btn-success px-10" onClick={handlePlay}>
            Play
          </button>
        )}
      </div>

      {play && (
        <>
          <div className="text-center mt-6">
            <p className="text-lg">next number: {current}</p>
          </div>

          <div className="relative w-[500px] h-[500px] border mt-4 mx-auto overflow-hidden">
            {circles
              .slice()
              .sort((a, b) => b.order - a.order)
              .map((circle, index) => {
                if (circle.clickedAt) {
                  const fade = (Date.now() - circle.clickedAt) / 1000;
                  const opacity = Math.max(1 - fade / 3, 0);
                  if (opacity <= 0) return null;
                  return (
                    <div
                      key={index}
                      className="absolute w-[50px] h-[50px] bg-amber-600  text-white flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-100"
                      style={{
                        left: circle.x,
                        top: circle.y,
                        zIndex: circles.length - circle.order + 1,
                        opacity,
                      }}
                    >
                      {circle.order}
                      <div className="absolute text-[10px] bottom-1 text-white">
                        {(3 - fade).toFixed(1)}s
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="absolute w-[50px] h-[50px] border-2 bg-amber-50 border-amber-600 text-black flex items-center justify-center rounded-full cursor-pointer"
                    style={{
                      left: circle.x,
                      top: circle.y,
                      zIndex: circles.length - circle.order + 1,
                    }}
                    onClick={() => handleCircleClick(circle.order)}
                  >
                    {circle.order}
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
