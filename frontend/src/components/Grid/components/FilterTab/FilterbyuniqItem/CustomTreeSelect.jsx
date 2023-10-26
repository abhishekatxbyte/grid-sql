// import React, { useState } from "react";
// import { TreeSelect } from "antd";
// import { useSelector } from "react-redux";

// const { TreeNode } = TreeSelect;

// const CustomTreeSelect = ({ dataIndex, setDataSource }) => {
//   const data = useSelector((state) => state.data.dataArray);
//   const currentTabIndex = useSelector(
//     (state) => state.data.setCurrentFileIndex
//   );
//   const dataArray = data[currentTabIndex];
//   const uniqueValues = new Set();
//   const uniqueValuesArray = dataArray.reduce((acc, item) => {
//     const propertyValue = item[dataIndex];
//     if (!uniqueValues.has(propertyValue)) {
//       uniqueValues.add(propertyValue);
//       acc.push(propertyValue);
//     }
//     return acc;
//   }, []);

//   const [selectedValues, setSelectedValues] = useState([]);
//   const options = uniqueValuesArray.map((value) => ({
//     title: value,
//     value: value,
//   }));
//   console.log(options);
//   const treeData = [
//     {
//       title: "select all",
//       value: "all",
//       children: options,
//     },
//   ];

//   const handleChange = (value) => {
//     setSelectedValues(value); // Update the selected values in state
//     function filterObjectsByProperty(dataArray, propertyName, propertyValues) {
//       return dataArray.filter((item) =>
//         propertyValues.includes(item[propertyName])
//       );
//     }
//     const filteredObjects = filterObjectsByProperty(
//       dataArray,
//       dataIndex,
//       value
//     );
//     console.log(filteredObjects);
//     if (filteredObjects.length) {
//       setDataSource(filteredObjects);
//     } else {
//       setDataSource(dataArray);
//     }
//   };
//   return (
//     <TreeSelect
//       placeholder="Please select"
//       treeCheckable
//       showCheckedStrategy={TreeSelect.SHOW_PARENT}
//       value={selectedValues}
//       onChange={handleChange}
//       style={{ width: "100%", height: "auto" }}
//     >
//       {treeData.map((node) => (
//         <TreeNode key={node.value} title={node.title} value={node.value}>
//           {node.children &&
//             node.children.map((childNode) => (
//               <TreeNode
//                 placeholder="Please select"
//                 key={childNode.value}
//                 title={childNode.title}
//                 value={childNode.value}
//               />
//             ))}
//         </TreeNode>
//       ))}
//     </TreeSelect>
//   );
// };

// export default CustomTreeSelect;
//WORKIND-SEARCH NOT WORKING
// import React, { useState } from "react";
// import { Tree, Input } from "antd";
// import { useSelector } from "react-redux";

// const { Search } = Input;

// const CustomTree = ({ dataIndex, setDataSource }) => {
//   const data = useSelector((state) => state.data.dataArray);
//   const currentTabIndex = useSelector(
//     (state) => state.data.setCurrentFileIndex
//   );
//   const dataArray = data[currentTabIndex];

//   const [expandedKeys, setExpandedKeys] = useState([]);
//   const [searchValue, setSearchValue] = useState([]);
//   const [selectedValues, setSelectedValues] = useState([]);

//   const generateData = (data, dataIndex, searchValue) => {
//     const uniqueValues = new Set();
//     const uniqueValuesArray = data.reduce((acc, item) => {
//       const propertyValue = item[dataIndex];
//       if (!uniqueValues.has(propertyValue)) {
//         uniqueValues.add(propertyValue);
//         acc.push(propertyValue);
//       }
//       return acc;
//     }, []);

//     const options = uniqueValuesArray.map((value) => ({
//       title: value,
//       value: value,
//     }));

//     const treeData = [
//       {
//         title: "select all",
//         key: "all",
//         children: options.map((value) => ({
//           title: value.title,
//           key: value.value,
//         })),
//       },
//     ];

//     const loop = (data) =>
//       data.map((item) => {
//         const strTitle = item.title;
//         const index = strTitle.indexOf(searchValue);
//         const beforeStr = strTitle.substring(0, index);
//         const afterStr = strTitle.slice(index + searchValue.length);
//         const title =
//           index > -1 ? (
//             <span>
//               {beforeStr}
//               <span className="site-tree-search-value">{searchValue}</span>
//               {afterStr}
//             </span>
//           ) : (
//             <span>{strTitle}</span>
//           );
//         if (item.children) {
//           return {
//             title,
//             key: item.key,
//             children: loop(item.children),
//           };
//         }
//         return {
//           title,
//           key: item.key,
//         };
//       });

//     return loop(treeData);
//   };

//   const onExpand = (newExpandedKeys) => {
//     setExpandedKeys(newExpandedKeys);
//   };

//   const onChange = (e) => {
//     const { value } = e.target;
//     setSearchValue(value);
//   };

//   const onCheck = (checkedKeys) => {
//     setSelectedValues(checkedKeys);

//     function filterObjectsByProperty(dataArray, propertyName, propertyValues) {
//       return dataArray.filter((item) =>
//         propertyValues.includes(item[propertyName])
//       );
//     }

//     const filteredObjects =
//       checkedKeys.includes("all") || checkedKeys.length === 0
//         ? dataArray
//         : filterObjectsByProperty(dataArray, dataIndex, checkedKeys);

//     setDataSource(filteredObjects);
//   };

//   return (
//     <div>
//       <Search
//         style={{
//           marginBottom: 8,
//         }}
//         placeholder="Search"
//         onChange={onChange}
//       />
//       <Tree
//         checkable
//         onExpand={onExpand}
//         expandedKeys={expandedKeys}
//         autoExpandParent={false}
//         checkedKeys={selectedValues}
//         onCheck={onCheck}
//         treeData={generateData(dataArray, dataIndex, searchValue)}
//       />
//     </div>
//   );
// };

// export default CustomTree;
import React, { useState } from "react";
import { Tree, Input } from "antd";
import { useSelector } from "react-redux";
import "./style.css";

const { Search } = Input;

const CustomTree = ({ dataIndex, setDataSource }) => {
  const data = useSelector((state) => state.data.dataArray);
  const currentTabIndex = useSelector(
    (state) => state.data.setCurrentFileIndex
  );
  const dataArray = data[currentTabIndex];

  const [expandedKeys, setExpandedKeys] = useState(["all"]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

  const generateData = (data, dataIndex, searchValue) => {
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
