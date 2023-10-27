import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";

import { MenuUnfoldOutlined } from "@ant-design/icons";
import { ConfigProvider, Input, Popover, Table, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { EditableCell, Row } from "./components/columns";

import FilterTabs from "./components/FilterTabs/FilterTabs";
import axios from "axios";
function filterArrayByProperty(data, propertyName, inputValue) {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  const regex = new RegExp(inputValue, "i");
  return data.filter((item) => {
    const propertyValue = String(item[propertyName]);
    if (typeof propertyValue == "number") {
      // Convert the input value to a number and check for equality
      const numericInputValue = parseFloat(inputValue);
      return propertyValue === numericInputValue;
    } else if (typeof propertyValue === "string") {
      // Check if the property value contains the input value
      return regex.test(propertyValue);
    }
    return item;
  });
}

const InputComponent = ({ column, setDataSource }) => {
  const data = useSelector((state) => state.data.data);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    // Filter the data based on the 'column' property and inputValue
    const filteredData = filterArrayByProperty(data, column, inputValue);
    if (filteredData.length > 0) {
      setDataSource(filteredData);
    }
  };
  return (
    <div>
      <Input
        type="text"
        placeholder="Type to filter"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

const Grid = ({ data, keyOfTab }) => {
  const [state, setstate] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((res) => {
        setloading(false);
        setstate(
          res.data.map((row) => ({
            Name: row.name,
            Email: row.email,
            id: row.id,
          }))
        );
      });
  };
  const [dataSource, setDataSource] = useState(data);
  const leftPinnedColumns = useSelector(
    (state) => state.data.leftPinnedColumns
  );
  const rightPinnedColumns = useSelector(
    (state) => state.data.rightPinnedColumns
  );
  const scroll = { x: "max-content", y: "100%" };
  const dynamicColumns = Object.keys(dataSource[0]).map((key) => {
    let fixedValue = null;
    if (leftPinnedColumns.includes(key)) {
      fixedValue = "left";
    } else if (rightPinnedColumns.includes(key)) {
      fixedValue = "right";
    } else {
      fixedValue = "null";
    }
    return {
      fixed: fixedValue,
      dataIndex: key,
      editable: true,
      ellipsis: {
        showTitle: false,
      },
      render: (key) => (
        <Tooltip placement="topLeft" title={key}>
          {key}
        </Tooltip>
      ),
      width: "10rem",
      title: (
        <div style={{ display: "flex", gap: "1em" }}>
          <InputComponent
            key={key}
            column={key}
            setDataSource={setDataSource}
          />
          <Popover
            trigger={"click"}
            placement="rightTop"
            content={
              <div>
                <FilterTabs dataIndex={key} setDataSource={setDataSource} />
              </div>
            }
          >
            <MenuUnfoldOutlined />
          </Popover>
        </div>
      ),
      children: [
        {
          title: key,
          dataIndex: key,
          editable: true,
          width: "5rem",
          ellipsis: {
            showTitle: false,
          },
          render: (key) => (
            <Tooltip placement="topLeft" title={key}>
              {key}
            </Tooltip>
          ),
          sorter: (a, b) => {
            const valueA =
              typeof a[key] === "number" ? a[key] : parseFloat(a[key]) || 0;
            const valueB =
              typeof b[key] === "number" ? b[key] : parseFloat(b[key]) || 0;

            if (valueA < valueB) {
              return -1;
            }
            if (valueA > valueB) {
              return 1;
            }

            // If numeric comparison didn't determine the order, fall back to string comparison
            return String(a[key]).localeCompare(String(b[key]));
          },
          sortDirections: ["ascend", "descend"],

          filterSearch: true,

          fixed: fixedValue,
        },
      ],
    };
  });
  dynamicColumns.unshift({
    title: "",
    dataIndex: "sort",
    key: "sort",
    render: () => null,
    width: "3%",
    fixed: "left",
    ellipsis: true,
  });

  dynamicColumns.pop();

  const sortedColumns = dynamicColumns.sort((a, b) => {
    if (a.fixed === "left") return -1;
    if (b.fixed === "left") return 1;
    if (a.fixed === "right") return 1; // Move right-pinned columns to the end
    if (b.fixed === "right") return -1; // Move right-pinned columns to the end
    return 0;
  });
  const handleSave = (row) => {
    const newData = dataSource.map((item) => {
      if (item.key === row.key) {
        return {
          ...item,
          ...row,
        };
      }
      return item;
    });
    setDataSource(newData);
  };
  const filteredColumns = sortedColumns.filter(
    (col) => col.title !== "fileName"
  );

  const mapColumns = (col) => {
    if (!col.editable) {
      return col;
    }
    const newCol = {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
    if (col.children) {
      newCol.children = col.children.map(mapColumns);
    }
    return newCol;
  };

  const columns = filteredColumns.map(mapColumns);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };
  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowHoverBg: " #e6f4ff",

              /* here is your component tokens */
            },
          },
        }}
      >
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                  cell: EditableCell,
                },
              }}
              scroll={scroll}
              loading={loading}
              rowKey="key"
              size="middle"
              columns={columns}
              tableLayout="fixed"
              dataSource={dataSource}
              bordered={true}
            />
          </SortableContext>
        </DndContext>
      </ConfigProvider>
    </div>
  );
};
export default Grid;
