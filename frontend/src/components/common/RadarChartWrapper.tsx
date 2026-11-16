import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { RadarMetricsBatter, RadarMetricsBowler } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface RadarChartWrapperProps {
  player1Name: string;
  player1Data: RadarMetricsBatter | RadarMetricsBowler;
  player1Color?: string;
  player2Name?: string;
  player2Data?: RadarMetricsBatter | RadarMetricsBowler;
  player2Color?: string;
  type: 'batter' | 'bowler';
  height?: number;
}

export const RadarChartWrapper: React.FC<RadarChartWrapperProps> = ({
  player1Name,
  player1Data,
  player1Color = '#E5008A', // Royals Pink
  player2Name,
  player2Data,
  player2Color = '#650D73', // Royals Purple
  type,
  height = 320,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridStroke = isDark ? '#673A70' : '#E2D9E7';
  const textFill = isDark ? '#C5B4CE' : '#71677B';
  const effectiveP2Color = isDark && player2Color === '#650D73' ? '#B855D6' : player2Color;

  // Dimension names
  const batterKeys: { key: keyof RadarMetricsBatter; label: string }[] = [
    { key: 'power_hitting', label: 'Power Hitting' },
    { key: 'run_rate_acceleration', label: 'Run Acceleration' },
    { key: 'dot_mitigation', label: 'Dot Mitigation' },
    { key: 'situational_value', label: 'Context Value' },
    { key: 'consistency', label: 'Match Consistency' },
  ];

  const bowlerKeys: { key: keyof RadarMetricsBowler; label: string }[] = [
    { key: 'run_containment', label: 'Run Containment' },
    { key: 'pressure_elevation', label: 'Econ Suppression' },
    { key: 'dot_generation', label: 'Dot Generation' },
    { key: 'runs_prevented', label: 'Runs Prevented' },
    { key: 'wicket_threat', label: 'Wicket Threat' },
  ];

  const dimensions = type === 'batter' ? batterKeys : bowlerKeys;

  const chartData = dimensions.map((dim) => {
    const entry: Record<string, string | number> = {
      subject: dim.label,
      [player1Name]: (player1Data as any)[dim.key] ?? 50,
    };
    if (player2Name && player2Data) {
      entry[player2Name] = (player2Data as any)[dim.key] ?? 50;
    }
    return entry;
  });

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
          <PolarGrid stroke={gridStroke} strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: textFill, fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke={gridStroke}
            tick={{ fill: textFill, fontSize: 9 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#3A174A' : '#FFFFFF',
              borderColor: isDark ? '#673A70' : '#F1DCE9',
              borderRadius: '12px',
              fontSize: '12px',
              color: isDark ? '#FFFFFF' : '#23142E',
              boxShadow: '0 4px 20px rgba(101, 13, 115, 0.15)',
            }}
          />
          <Radar
            name={player1Name}
            dataKey={player1Name}
            stroke={player1Color}
            fill={player1Color}
            fillOpacity={0.4}
            strokeWidth={2.5}
          />
          {player2Name && (
            <Radar
              name={player2Name}
              dataKey={player2Name}
              stroke={effectiveP2Color}
              fill={effectiveP2Color}
              fillOpacity={0.35}
              strokeWidth={2.5}
            />
          )}
          {player2Name && (
            <Legend
              wrapperStyle={{
                paddingTop: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: textFill,
              }}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
