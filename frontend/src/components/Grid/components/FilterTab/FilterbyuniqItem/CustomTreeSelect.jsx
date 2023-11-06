import React, { useState } from "react";
import { Tree, Input } from "antd";
import { useSelector } from "react-redux";
import "./style.css";

const { Search } = Input;

const CustomTree = ({ dataIndex, setDataSource }) => {
  const data = useSelector((state) => state.data.data);
  console.log(data);
  const currentTabIndex = useSelector(
    (state) => state.data.setCurrentFileIndex
  );
  console.log(currentTabIndex);
  const dataArray = data;
  console.log(dataArray);
  const [expandedKeys, setExpandedKeys] = useState(["all"]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

  const generateData = (data, dataIndex, searchValue) => {
    console.log(data);
    const uniqueValues = new Set();
    const uniqueValuesArray = data.reduce((acc, item) => {
      const propertyValue = item[dataIndex];
      if (!uniqueValues.has(propertyValue)) {
        uniqueValues.add(propertyValue);
        acc.push(propertyValue);
      }
      return acc;
    }, []);

    const options = uniqueValuesArray.map((value) => ({
      title: value,
      value: value,
    }));

    const filteredOptions = options.filter((option) =>
      String(option.title).includes(searchValue)
    );

    const treeData = [
      {
        title: "select all",
        key: "all",
        children: filteredOptions.map((value) => ({
          title: value.title,
          key: value.value,
        })),
      },
    ];

    const loop = (data) =>
      data.map((item) => {
        const strTitle = String(item.title); // Ensure strTitle is a string
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          title,
          key: item.key,
        };
      });

    return loop(treeData);
  };

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
  };

  const onChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const onCheck = (checkedKeys) => {
    setSelectedValues(checkedKeys);

    function filterObjectsByProperty(dataArray, propertyName, propertyValues) {
      return dataArray.filter((item) =>
        propertyValues.includes(item[propertyName])
      );
    }

    const filteredObjects =
      checkedKeys.includes("all") || checkedKeys.length === 0
        ? dataArray
        : filterObjectsByProperty(dataArray, dataIndex, checkedKeys);

    setDataSource(filteredObjects);
  };

  return (
    <div className="overflow-auto">
      <Search
        style={{
          marginBottom: 8,
        }}
        placeholder="Search"
        onChange={onChange}
      />
      <div className=" overflow-auto">
        <Tree
          checkable
          // onExpand={true}
          className="max-h-[200px] max-w-2"
          expandedKeys={expandedKeys}
          autoExpandParent={false}
          checkedKeys={selectedValues}
          onCheck={onCheck}
          treeData={generateData(dataArray, dataIndex, searchValue)}
        />
      </div>
    </div>
  );
};

export default CustomTree;
