import { useEffect, useRef, useState } from "react";

const CircleGame = () => {
  const [pixel, setPixel] = useState(false);
  const [input, setInput] = useState("");
  const [play, setPlay] = useState(false);
  const [current, setCurrent] = useState(1);
  const [circles, setCircles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [allClear, setAllClear] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalTick, setIntervalTick] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoInterval, setAutoInterval] = useState(null);
  const currentRef = useRef(current);
  const gameOverRef = useRef(gameOver);
  const allClearRef = useRef(allClear);
  const circlesRef = useRef(circles);
  const intervalTickRef = useRef(intervalTick);
  const autoIntervalRef = useRef(autoInterval);

  const playRef = useRef(play);

  useEffect(() => {
    playRef.current = play;
    currentRef.current = current;
    gameOverRef.current = gameOver;
    allClearRef.current = allClear;
    circlesRef.current = circles;
    intervalTickRef.current = intervalTick;
    autoIntervalRef.current = autoInterval;
  }, [current, gameOver, allClear, circles]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^[1-9][0-9]*$/.test(value) || value === "") {
      setInput(value);
    }
  };

  const handlePixel = () => {
    setPixel(!pixel);
  };
  const handleAutoPlay = () => {
    if (autoPlay) {
      clearInterval(autoInterval);
      setAutoInterval(null);
      setAutoPlay(false);
      return;
    }

    setAutoPlay(true);
    const id = setInterval(() => {
      setCircles((prev) => {
        const target = currentRef.current;
        console.log(target);
        const next = prev.find((c) => c.order === target && !c.clickedAt);
        if (next) handleCircleClick(next.order);
        return prev;
      });
    }, 500);
    setAutoInterval(id);
  };

  const handlePlay = () => {
    const count = parseInt(input);
    if (!isNaN(count)) {
      generateCircles(count);
      setPlay(true);
      const now = Date.now();
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
    if (!playRef.current || gameOverRef.current || allClearRef.current) return;

    if (order === currentRef.current) {
      const now = Date.now();
      setCircles((prev) =>
        prev.map((c) => (c.order === order ? { ...c, clickedAt: now } : c))
      );

      if (order === circlesRef.current.length) {
        setDisabled(true);
        setTimeout(() => {
          if (
            !gameOverRef.current &&
            !allClearRef.current &&
            currentRef.current === circlesRef.current.length
          ) {
            setAllClear(true);
            clearInterval(intervalTickRef.current);
            clearInterval(autoIntervalRef.current);
            setAutoPlay(false);
          }
          setDisabled(false);
        }, 3000);
      } else {
        setCurrent(currentRef.current + 1);
      }
    } else {
      clearInterval(intervalTickRef.current);
      clearInterval(autoIntervalRef.current);
      setAutoPlay(false);
      setGameOver(true);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalTickRef.current);
      clearInterval(autoIntervalRef.current);
    };
  }, []);

  return (
    <div
      className={`w-2/6 h-full mx-auto !mt-10 border-2 border-black py-14 px-10 bg-amber-100  ${
        pixel ? "silkscreen-regular" : ""
      }`}
    >
      <div className="flex flex-row justify-between">
        <h2
          className={`silkscreen-bold text-2xl font-bold mb-4 ${
            gameOver
              ? "text-red-500"
              : allClear
              ? "text-green-500"
              : "text-black"
          }`}
        >
          {gameOver ? "GAME OVER" : allClear ? "ALL CLEARED!" : "LET'S PLAY"}
        </h2>
        <button className="btn btn-secondary font-light " onClick={handlePixel}>
          pixelate
        </button>
      </div>
      <p className="mt-2 text-black text-lg">
        <span>Time:</span>
        <span className="ml-8">{(elapsedTime / 1000).toFixed(2)}s</span>
      </p>
      <label htmlFor="numberOfCircle" className="mr-6 text-black ">
        Points:
      </label>
      <input
        id="numberOfCircle"
        name="numberOfCircle"
        className="input w-fit"
        type="text"
        inputMode="numeric"
        placeholder="input number..."
        value={input}
        onChange={handleChange}
      />
      <div className="flex gap-4 mt-6">
        {play ? (
          <>
            <button
              className="btn  btn-warning px-10 text-black "
              onClick={handleRestart}
            >
              Restart
            </button>
            <button
              className={`btn px-10  ${autoPlay ? "btn-error" : "btn-info"}`}
              onClick={handleAutoPlay}
            >
              {autoPlay ? "Stop AutoPlay" : "AutoPlay"}
            </button>
          </>
        ) : (
          <button className="btn btn-success px-10" onClick={handlePlay}>
            Play
          </button>
        )}
      </div>
      <div className="text-center mt-6">
        <p className="text-lg text-black ">Next number: {current}</p>
      </div>
      <div className="relative w-[500px] h-[500px] border-2 border-black mt-4 mx-auto overflow-hidden bg-amber-50">
        {play ? (
          circles
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
                    className="absolute w-[50px] h-[50px] bg-amber-600 text-white flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-100"
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
            })
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Input number and click Play to start
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircleGame;
