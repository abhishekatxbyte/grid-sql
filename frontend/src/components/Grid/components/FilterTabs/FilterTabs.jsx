import React from "react";
import { Tabs } from "antd";
import CustomTreeSelect from "../FilterTab/FilterbyuniqItem/CustomTreeSelect";
import PinPopover from "../FilterTab/Popovers/PinPopover";
import FilterbyuniqItem from "../FilterTab/FilterbyuniqItem/FilterbyuniqItem";

const FilterTabs = ({ dataIndex, setDataSource }) => {
  const content = (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex" }}>
        <CustomTreeSelect dataIndex={dataIndex} setDataSource={setDataSource} />
        <PinPopover dataIndex={dataIndex} />
      </div>
      <span className="custom-divider"></span>
      <FilterbyuniqItem
        key={dataIndex}
        dataIndex={dataIndex}
        setDataSource={setDataSource}
      />
    </div>
  );
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Tab 1",
      children: (
        <div className="flex flex-col gap-2 max-w-[200px] overflow-auto">
          <PinPopover dataIndex={dataIndex} />
          <FilterbyuniqItem
            key={dataIndex}
            dataIndex={dataIndex}
            setDataSource={setDataSource}
          />
          <CustomTreeSelect
            dataIndex={dataIndex}
            setDataSource={setDataSource}
          />
        </div>
      ),
    },
    // {
    //   key: "2",
    //   label: "Tab 2",
    //   children: (
    //     <div className="flex flex-col gap-2">
    //       <FilterbyuniqItem
    //         key={dataIndex}
    //         dataIndex={dataIndex}
    //         setDataSource={setDataSource}
    //       />
    //       <CustomTreeSelect
    //         dataIndex={dataIndex}
    //         setDataSource={setDataSource}
    //       />
    //     </div>
    //   ),
    // },
  ];
  return (
    <div className="flex items-center justify-center flex max-w-[200px] overflow-auto">
      <Tabs
        className="flex items-center justify-center"
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </div>
  );
};

export default FilterTabs;
