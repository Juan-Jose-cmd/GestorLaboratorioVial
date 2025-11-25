import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface Props {
    data: { id: string; humedad: number }[];
}

const HumedadChart = ({ data }: Props) => {
    return (
        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
                    <BarChart data={data}>
                    <CartesianGrid stroke="#233554" />
                    <XAxis dataKey="id" stroke="#64FFDA" />
                    <YAxis stroke="#64FFDA" />
                    <Tooltip />
                    <Bar dataKey="humedad" fill="#64FFDA" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HumedadChart;
