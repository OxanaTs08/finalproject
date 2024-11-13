import { useEffect } from "react";
import AppRouter from "./AppRouter";
import { RootState } from "./redux/store";
import { useSelector } from "react-redux";
import { showCurrentUser } from "./redux/userSlice";
import { useAppDispatch } from "./hooks/useAppDispatch";

function App() {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.users.token);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Token in App:", token);

  useEffect(() => {
    if (token && !currentUser) {
      dispatch(showCurrentUser());
      console.log("1");
    }
  }, []);

  console.log("Current user in App:", currentUser);

  return (
    <div className="App">
      <header className="App-header">
        <AppRouter />
      </header>
    </div>
  );
}

export default App;
