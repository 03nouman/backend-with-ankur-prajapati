import routes from "./app/app.routes";
import { RouterProvider } from "react-router";
import { UserProvider } from "./app/context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={routes} />
    </UserProvider>
  );
};

export default App;
