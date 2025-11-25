import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./routes/public.routes";
import { LaboratoristaRoutes } from "./routes/laboratorista.routes";
import { DirectorRoutes } from "./routes/director.routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {PublicRoutes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}

        {LaboratoristaRoutes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}

        {DirectorRoutes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
