export function LineChart({ 
  data, 
  width = "100%", 
  height = 240, 
  color = "#2563eb",
  showGrid = true 
}) {
  if (!data || data.length === 0) return null;

  // Find min and max for scaling
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const padding = 30;
  const chartWidth = 1000;
  const chartHeight = height - padding * 2;

  // Scale points to fit the chart
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * (chartWidth - padding * 2) + padding,
    y: chartHeight - (d.score - minScore) / (maxScore - minScore) * chartHeight + padding
  }));

  // Create the path for the line
  const pathData = points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    // Use curve interpolation for smoother lines
    const prevPoint = points[i - 1];
    const controlPoint1X = (prevPoint.x + point.x) / 2;
    const controlPoint2X = (prevPoint.x + point.x) / 2;
    return `${path} C ${controlPoint1X} ${prevPoint.y}, ${controlPoint2X} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  // Create grid lines
  const gridLines = showGrid ? Array.from({ length: 5 }, (_, i) => {
    const y = padding + (chartHeight * i) / 4;
    return (
      <line
        key={`grid-${i}`}
        x1={padding}
        y1={y}
        x2={chartWidth - padding}
        y2={y}
        stroke="#e2e8f0"
        strokeWidth="1"
        strokeDasharray="5,5"
      />
    );
  }) : null;

  return (
    <div className="w-full h-full" style={{ minHeight: height }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        width={width}
        height={height}
        className="overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {gridLines}

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          className="transition-all duration-500 ease-in-out"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="transition-all duration-500 ease-in-out"
            />
            {/* Labels */}
            <text
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
            >
              {data[i].week}
            </text>
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
            >
              {data[i].score}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}