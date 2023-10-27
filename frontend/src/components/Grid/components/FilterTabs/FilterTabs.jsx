import React from "react";
import { Tabs } from "antd";
import CustomTreeSelect from "../FilterTab/FilterbyuniqItem/CustomTreeSelect";
import PinPopover from "../FilterTab/Popovers/PinPopover";
import FilterbyuniqItem from "../FilterTab/FilterbyuniqItem/FilterbyuniqItem";

const FilterTabs = ({ dataIndex, setDataSource }) => {
  return (
    <div className="flex items-center justify-center flex max-w-[200px] overflow-auto">
      <div className="flex flex-col gap-2 max-w-[200px] overflow-auto">
        <PinPopover dataIndex={dataIndex} />
        <FilterbyuniqItem
          key={dataIndex}
          dataIndex={dataIndex}
          setDataSource={setDataSource}
        />
        <CustomTreeSelect dataIndex={dataIndex} setDataSource={setDataSource} />
      </div>
    </div>
  );
};

export default FilterTabs;
