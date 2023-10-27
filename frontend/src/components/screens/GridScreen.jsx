import { useEffect, useState } from "react";
import { Button, Tabs } from "antd";

import File from "./../File";
import { useDispatch, useSelector } from "react-redux";
import Grid from "./../Grid/GridWithApi";
import {
  SET_CURRENT_FILE_INDEX,
  SET_DATA,
  SET_FILTERED_DATA,
} from "./../../store/slice";
import PivotTable from "./../PivotTable/PivotTable";
const TabsOfGrid = () => {
  const dataArray = useSelector((state) => state.data.dataArray);
  const [key, setKey] = useState(0);
  const TabIndex = useSelector((state) => state.data.setCurrentFileIndex);
  const dispatch = useDispatch();
  const fileName = dataArray.map((data) => {
    return data[0].fileName;
  });
  const data = useSelector((state) => state.data.data);
  const fileNames = useSelector((state) => state.data.fileNames);
  const filtereData = useSelector((state) => state.data.filteredData);

  const handleChange = (key) => {
    setKey(key);
    dispatch(SET_FILTERED_DATA([]));
    dispatch(SET_DATA(dataArray[key]));
    dispatch(SET_CURRENT_FILE_INDEX(key));
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        type="card"
        style={{ userSelect: "none", top: "50px" }}
        size={"large"}
        items={dataArray.map((_, i) => {
          return {
            label: fileNames[i],
            key: i,

            children: (
              <>
                {filtereData.length > 0 && (
                  <Button
                    style={{ float: "right" }}
                    onClick={() => dispatch(SET_FILTERED_DATA([]))}
                  >
                    clear filter
                  </Button>
                )}{" "}
                <div className="grid_container">
                  <Grid data={data} keyOfTab={key} />
                </div>
              </>
            ),
          };
        })}
        onChange={handleChange}
      />
    </div>
  );
};

function GridScreen() {
  const dataArray = useSelector((state) => state.data.dataArray);
  const data = useSelector((state) => state.data.data);
  const [key, setKey] = useState("1");
  const handleChange = (key) => {
    setKey(key);
  };
  const items = [
    {
      key: "1",
      label: "GRID",
    },
    {
      key: "2",
      label: "PIVOT TABLE",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <File />
      {dataArray.length > 0 && (
        <div>{key == 1 ? <TabsOfGrid /> : <PivotTable data={data} />}</div>
      )}

      <div style={{ position: "absolute", right: "2%", top: "0%" }}>
        {dataArray.length > 0 && (
          <Tabs onChange={handleChange} defaultActiveKey="1" items={items} />
        )}
      </div>
    </div>
  );
}

export default GridScreen;
