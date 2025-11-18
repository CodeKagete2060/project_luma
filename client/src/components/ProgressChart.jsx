import { useState } from 'react';

export default function ProgressChart({ 
  data = [],
  title = 'Progress Overview',
  height = 300,
  showLegend = true,
}) {
  const [selectedMetric, setSelectedMetric] = useState('score');

  // Responsive chart width (fallback if no window)
  const chartWidth = 800;
  const chartHeight = height - 40;
  const padding = 40;

  // Guard: handle empty or single data points safely
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-center text-gray-500">
        No data available
      </div>
    );
  }

  // Extract metric values
  const values = data.map(d => d[selectedMetric] ?? 0);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue - minValue || 1; // avoid division by zero

  // Scale points
  const points = data.map((d, i) => {
    const x =
      data.length === 1
        ? chartWidth / 2
        : (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y =
      chartHeight -
      ((d[selectedMetric] - minValue) / valueRange) * chartHeight +
      padding;
    return { x, y };
  });

  // Create smooth Bezier curve
  const pathData = points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const controlX = (prev.x + point.x) / 2;
    return `${path} C ${controlX} ${prev.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const metrics = [
    { id: 'score', label: 'Score' },
    { id: 'time', label: 'Time Spent' },
    { id: 'assignments', label: 'Assignments' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        {showLegend && (
          <div className="flex gap-2 flex-wrap">
            {metrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedMetric === metric.id
                    ? 'bg-[#2C139E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full" style={{ height }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          width="100%"
          height={height}
          className="overflow-visible"
          aria-label={`${title} Chart`}
        >
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = padding + (chartHeight * i) / 4;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            );
          })}

          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke="#2C139E"
            strokeWidth="3"
            className="transition-all duration-500"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#2C139E"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              {/* Value label */}
              <text
                x={point.x}
                y={point.y - 10}
                textAnchor="middle"
                fontSize="12"
                fill="#4B5563"
              >
                {data[i][selectedMetric]}
              </text>
              {/* Label (e.g., date) */}
              <text
                x={point.x}
                y={height - 10}
                textAnchor="middle"
                fontSize="12"
                fill="#6B7280"
              >
                {data[i].label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
