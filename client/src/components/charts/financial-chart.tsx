import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
  }>;
}

export default function FinancialChart({ data }: FinancialChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-muted-foreground"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-muted-foreground"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `£${value.toLocaleString()}`}
        />
        <Tooltip 
          formatter={(value, name) => [`£${(value as number).toLocaleString()}`, name]}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--success))" 
          strokeWidth={2}
          name="Revenue"
          dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="hsl(var(--destructive))" 
          strokeWidth={2}
          name="Expenses"
          dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
