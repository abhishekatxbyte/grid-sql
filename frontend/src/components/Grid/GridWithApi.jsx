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
import { useDispatch, useSelector } from "react-redux";
import { EditableCell, Row } from "./components/columns";

import FilterTabs from "./components/FilterTabs/FilterTabs";
import axios from "axios";
import { setData } from "../../store/fileUploadSlice";
import { SET_DATA } from "../../store/slice";
// import { fetchData, setPage } from "../../store/fileUploadSlice";
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

const Grid = () => {
  const unique_identifier = useSelector(
    (state) => state.fileUpload.uniqueIdentifier
  );
  const data = useSelector((state) => state.fileUpload.receivedData);
  const [totalPage, setTotalPage] = useState(10);
  const [dataSource, setDataSource] = useState(data);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState(10);
  const [sort, setSort] = useState({
    sortDirection: "desc",
    sortField: null,
  });
  const dispatch = useDispatch();
  const fetchData = async () => {
    setLoading((prev) => !prev);
    try {
      const getResponse = await axios.get(
        `http://192.168.2.194:3000/api/file_upload?unique_identifier=${unique_identifier}&page=${selectedPage}&limit=${selectedLimit}&sortField=${sort.sortField}&sort=${sort.sortDirection}`
      );
      setDataSource(getResponse.data.data);
      dispatch(SET_DATA(getResponse.data.data));
      setTotalPage(getResponse.data.totalPages);
      setLoading(false);

      return getResponse;
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    if (unique_identifier) {
      fetchData();
    }
  }, [unique_identifier, selectedPage, selectedLimit, sort]);

  const leftPinnedColumns = useSelector(
    (state) => state.data.leftPinnedColumns
  );
  const rightPinnedColumns = useSelector(
    (state) => state.data.rightPinnedColumns
  );
  console.log(loading);
  const scroll = { x: "fit-content", y: "600px" };

  if (!dataSource) {
    return <>nothing to show</>;
  }

  const dynamicColumns = Object.keys(dataSource[0]).map((key) => {
    let fixedValue = null;

    const handleSortClick = async (key) => {
      if (sort.sortDirection == "asc") {
        setSort({ sortDirection: "desc", sortField: key });
      } else {
        setSort({ sortDirection: "asc", sortField: key });
      }
    };
    console.log(sort);
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
          width: "8rem",
          onHeaderCell: () => {
            return {
              onClick: () => handleSortClick(key), // Call the handleSortClick function
            };
          },

          sorter: true,
          sortDirections: ["descend", "ascend", "descend"],
          defaultSortOrder: "ascend",
          filterSearch: true,
          fixed: fixedValue,
        },
      ],
    };
  });
  const newcolumns = dynamicColumns.slice(1);
  newcolumns.unshift({
    title: "",
    dataIndex: "sort",
    key: "sort",
    render: () => null,
    width: "35px",
    fixed: "left",
    ellipsis: true,
  });

  newcolumns.pop();
  newcolumns.pop();
  newcolumns.pop();

  const sortedColumns = newcolumns.sort((a, b) => {
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

  const handlePageChange = (page) => {
    setSelectedPage(page);
    console.log(selectedPage);
    console.log(sort);
  };
  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowHoverBg: " #e6f4ff",
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
              size="small"
              columns={columns}
              tableLayout="fixed"
              pagination={{
                defaultPageSize: 10,
                total: totalPage * 10,
                onShowSizeChange: (current, pageSize) =>
                  setSelectedLimit(pageSize),
                showTotal: (total) => `Total ${total} items`,
                showSizeChanger: true,
                onChange: (page) => handlePageChange(page),
              }}
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
