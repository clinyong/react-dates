import * as React from "react";
import * as ReactDOM from "react-dom";
import { SingleDate } from "../src/SingleDate";

import "./App.css";

class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div style={{ margin: 40 }}>
        <SingleDate />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
