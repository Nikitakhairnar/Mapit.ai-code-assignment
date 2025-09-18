import DataTable from "./components/dataTable";
import "./App.css";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [dataLoading, setDataLoading] = useState(true);

  setTimeout(() => {
    setDataLoading(false);
  }, 3000); // Simulate a 3-second loading time

  return (
    <div className="App">
      <header className="App-header">
        {dataLoading && (
          <>
            <h2>Loading Data...</h2>
            <CircularProgress color="white" thickness={5} />
          </>
        )}
        {!dataLoading && <DataTable />}
      </header>
    </div>
  );
}

export default App;
