import AppRouter from "./AppRouter";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { showCurrentUser } from "./redux/userSlice";

function App() {
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   dispatch(showCurrentUser());
  // }, []);
  return (
    <div className="App">
      <header className="App-header">
        <AppRouter />
      </header>
    </div>
  );
}

export default App;
