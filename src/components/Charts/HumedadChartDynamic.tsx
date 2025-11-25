import {
    BarChart, Bar,
    LineChart, Line,
    ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface Props {
    type: string;
    data: { id: string; humedad: number }[];
}

const HumedadChartDynamic = ({ type, data }: Props) => {
    return (
        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
                {type === "bar" && (
                    <BarChart data={data}>
                    <CartesianGrid stroke="#233554" />
                    <XAxis dataKey="id" stroke="#64FFDA" />
                    <YAxis stroke="#64FFDA" />
                    <Tooltip />
                    <Bar dataKey="humedad" fill="#64FFDA" />
                    </BarChart>
                )}

                {type === "line" && (
                    <LineChart data={data}>
                    <CartesianGrid stroke="#233554" />
                    <XAxis dataKey="id" stroke="#64FFDA" />
                    <YAxis stroke="#64FFDA" />
                    <Tooltip />
                    <Line type="monotone" dataKey="humedad" stroke="#64FFDA" strokeWidth={2} />
                    </LineChart>
                )}

                {type === "scatter" && (
                    <ScatterChart>
                    <CartesianGrid stroke="#233554" />
                    <XAxis type="category" dataKey="id" stroke="#64FFDA" />
                    <YAxis type="number" dataKey="humedad" stroke="#64FFDA" />
                    <Tooltip />
                    <Scatter data={data} fill="#64FFDA" />
                    </ScatterChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default HumedadChartDynamic;
