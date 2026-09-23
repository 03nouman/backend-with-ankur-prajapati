import routes from "./app/app.routes";
import { RouterProvider } from "react-router";
import AuthProvider from "./app/modules/auth/context/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
};

export default App;
