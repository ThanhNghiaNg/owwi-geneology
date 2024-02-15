import React from "react";
import MainView from "./MainView";
import Pippip from "./Pippip";
import { ReactFlowProvider } from "reactflow";

function App(props) {
  return (
    <div>
      <ReactFlowProvider>
        <MainView />
      </ReactFlowProvider>
      {/* <Pippip /> */}
    </div>
  );
}

export default App;
