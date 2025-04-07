import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./pages/(protected)/layout";
import Production from "./pages/(protected)/pages/Production";
import Sales from "./pages/(protected)/pages/sales";
import NewSale from "./pages/(protected)/pages/sales/new";
import Login from "./pages/login";
import { persistor, store } from "./store";

const queryClient = new QueryClient();

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route index element={<Navigate to="/vendas" />} />
                    <Route path="vendas">
                      <Route index element={<Sales />} />
                      <Route path="new" element={<NewSale />} />
                    </Route>
                    <Route path="producao" element={<Production />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </LocalizationProvider>
  );
}

export default App;
