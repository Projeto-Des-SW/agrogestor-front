import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/(protected)/(admin)/users";
import NewUser from "./pages/(protected)/(admin)/users/new";
import MainLayout from "./pages/(protected)/layout";
import Home from "./pages/(protected)/pages/home";
import Members from "./pages/(protected)/pages/members";
import NewMember from "./pages/(protected)/pages/members/new";
import Production from "./pages/(protected)/pages/production";
import NewProduction from "./pages/(protected)/pages/production/new";
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
                    <Route index element={<Home />} />
                    <Route path="vendas">
                      <Route index element={<Sales />} />
                      <Route path="new" element={<NewSale />} />
                      <Route path="edit/:id" element={<NewSale />} />
                    </Route>
                    <Route path="producao">
                      <Route index element={<Production />} />
                      <Route path="new" element={<NewProduction />} />
                      <Route path="edit/:id" element={<NewProduction />} />
                    </Route>
                    <Route
                      path="usuarios"
                      element={<ProtectedRoute adminOnly redirect="/" />}
                    >
                      <Route index element={<Users />} />
                      <Route path="new" element={<NewUser />} />
                      <Route path="edit/:id" element={<NewUser />} />
                    </Route>
                    <Route path="clientes">
                      <Route index element={<Members />} />
                      <Route path="new" element={<NewMember />} />
                      <Route path="edit/:id" element={<NewMember />} />
                    </Route>
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
