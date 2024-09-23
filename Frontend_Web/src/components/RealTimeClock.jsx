import { useState, useEffect } from "react";

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      const options = { weekday: "long" };
      const formattedTime = `${date.getFullYear()}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} : ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(
        2,
        "0"
      )} ${date.toLocaleDateString(undefined, options)}`;

      setCurrentTime(formattedTime);
    };

    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId); // Clean up the timer on component unmount
  }, []);

  return (
    <div className="relative flex flex-col flex-auto min-w-0 py-4 break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border overflow-hidden">
      {/* This div will contain the scrolling text */}
      <div className="w-full overflow-hidden">
        <div className="text-4xl font-bold text-black whitespace-nowrap animate-marquee">
          {currentTime}
        </div>
      </div>
    </div>
  );
};

export default RealTimeClock;
