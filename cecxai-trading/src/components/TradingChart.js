import { useEffect, useRef } from "react";

const TradingChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous chart
    container.innerHTML = "";

    // Create script for TradingView widget
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Define TradingView settings
    script.innerHTML = JSON.stringify({
      symbols: [["Bitcoin", "BINANCE:BTCUSDT"]],
      theme: "dark",
      width: "100%", // Full width
      height: 600, // Height can stay same
      locale: "en",
      timezone: "Etc/UTC",
      interval: "30",
      style: "1",
      toolbar_bg: "#131722",
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true, // Allows searching for any crypto
      save_image: false,
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="trading-chart">
      <div ref={containerRef} />
    </div>
  );
};

export default TradingChart;
