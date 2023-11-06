import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import { useState } from "react";
import { useSelector } from "react-redux";

function PivotTable() {
  const data = useSelector((state) => state.fileUpload.dataSource);
  if (!data) {
    return <>Please Upload File</>;
  }
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const [state, setState] = useState([]);
  if (data) {
    return <></>;
  }
  return (
    <div style={{ width: "100vw", position: "absolute", top: "50px" }}>
      <PivotTableUI
        data={data}
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        onChange={(s) => {
          setState(s);
        }}
        {...state}
      />
    </div>
  );
}

export default PivotTable;
