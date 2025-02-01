/* eslint-disable react/prop-types */
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function App({stats}) {
  const deviceCount = stats.reduce((acc, item) => {
    // Normalize device names
    let deviceType = item.device.toLowerCase();
    if (deviceType.includes('mobile') || deviceType.includes('android') || deviceType.includes('iphone')) {
      deviceType = 'Mobile';
    } else {
      deviceType = 'Desktop';
    }
    
    if (!acc[deviceType]) {
      acc[deviceType] = 0;
    }
    acc[deviceType]++;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device) => ({
    name: device,
    value: deviceCount[device],
  }));

  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <PieChart width={700} height={400}>
          <Tooltip 
            formatter={(value, name) => [`${value} clicks`, `${name}`]}
          />
          <Pie
            data={result}
            labelLine={false}
            dataKey="value"
            nameKey="name"
          >
            {result.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}