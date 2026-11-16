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
  player1Color = '#10B981',
  player2Name,
  player2Data,
  player2Color = '#38BDF8',
  type,
  height = 300,
}) => {
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
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[30, 100]}
            stroke="#1E293B"
            tick={{ fill: '#64748B', fontSize: 9 }}
          />
          <Radar
            name={player1Name}
            dataKey={player1Name}
            stroke={player1Color}
            fill={player1Color}
            fillOpacity={0.35}
            strokeWidth={2}
          />
          {player2Name && (
            <Radar
              name={player2Name}
              dataKey={player2Name}
              stroke={player2Color}
              fill={player2Color}
              fillOpacity={0.35}
              strokeWidth={2}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#334155',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#F8FAFC',
            }}
          />
          {player2Name && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
