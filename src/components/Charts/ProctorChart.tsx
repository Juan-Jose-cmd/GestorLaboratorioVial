import { Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, Label } from "recharts";

interface Props {
    data: { humedad: number; densidadSeca: number }[];
}

const ProctorChart = ({ data }: Props) => {
    if (data.length === 0) return null;

    // Ordeno por humedad
    const sortedData = [...data].sort((a, b) => a.humedad - b.humedad);

    // Busco la densidad seca máxima
    const max = Math.max(...sortedData.map(d => d.densidadSeca));
    const puntoOptimo = sortedData.find(d => d.densidadSeca === max);

    return (
        <div style={{ width: "100%", height: 350, padding: "10px" }}>
            <ResponsiveContainer>
    <LineChart
        data={sortedData}
        margin={{ top: 20, right: 25, bottom: 20, left: 40 }}
    >
        <CartesianGrid stroke="#233554" />
        <XAxis 
            dataKey="humedad" 
            stroke="#64FFDA"
            label={{ value: "Humedad (%)", position: "insideBottom", offset: -5, fill: "#64FFDA" }}
        />
        <YAxis
            stroke="#64FFDA"
            domain={[
                (dataMin: number) => Math.max(dataMin - 0.05, 0.5),   // mínimo seguro
                (dataMax: number) => dataMax + 0.05
            ]}
            label={{
            value: "Densidad seca (g/cm³)",
            angle: -90,
            position: "insideLeft",
            fill: "#64FFDA",
            dy: 15
            }}
        />


        <Tooltip />

        {/* Línea de tendencia */}
        <Line type="monotone" dataKey="densidadSeca" stroke="#64FFDA" strokeWidth={2} />

        {/* Puntos */}
        <Scatter data={sortedData} fill="#FFB703" stroke="#E9A100" />

        {/* Punto óptimo */}
        {puntoOptimo && (
            <Scatter data={[puntoOptimo]} fill="#00ff95" stroke="#00ff95" shape="circle" />
        )}
    </LineChart>
</ResponsiveContainer>
        </div>
    );
};

export default ProctorChart;
