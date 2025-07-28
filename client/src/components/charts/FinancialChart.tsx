import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface FinancialChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  height?: number;
}

export function FinancialChart({ data, height = 300 }: FinancialChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-muted-foreground"
          fontSize={12}
        />
        <YAxis 
          className="text-muted-foreground"
          fontSize={12}
          tickFormatter={formatCurrency}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), ""]}
          labelClassName="text-foreground"
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--success))" 
          strokeWidth={2}
          name="Revenue"
          dot={{ fill: "hsl(var(--success))", strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="hsl(var(--destructive))" 
          strokeWidth={2}
          name="Expenses"
          dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="profit" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          name="Profit"
          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
