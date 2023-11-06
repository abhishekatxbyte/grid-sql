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
import {
  data_source,
  filter_field,
  filter_values,
  loading_state,
  search_field,
  search_value,
  selected_limit,
  selected_page,
  setDataSource,
  setLoading,
  setSearchField,
  setSearchValue,
  setSelectedLimit,
  setSelectedPage,
  setSortDirection,
  setSortField,
  setTotalPage,
  sort_direction,
  sort_field,
  total_pages,
  unique_identifier,
} from "../../store/fileUploadSlice";
// import { fetchData, setPage } from "../../store/fileUploadSlice";

const fetchData = async () => {
  const uniqueIdentifier = useSelector(unique_identifier);
  const selectedPage = useSelector(selected_page);
  const selectedLimit = useSelector(selected_limit);
  const sortDirection = useSelector(sort_direction);
  const sortField = useSelector(sort_field);
  const searchField = useSelector(search_field);
  const searchValue = useSelector(search_value);
  const filterField = useSelector(filter_field);
  const filterValues = useSelector(filter_values);
  dispatch(setLoading(true));
  try {
    const params = {
      unique_identifier: uniqueIdentifier,
      page: selectedPage,
      limit: selectedLimit,
      sortField: sortField,
      sort: sortDirection,
      searchField: searchField,
      searchValue: searchValue,
      filterField: filterField,
      filterValues: filterValues,
    };

    const queryString = Object.entries(params)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const url = `http://192.168.2.194:3000/api/file_upload?${queryString}`;

    const getResponse = await axios.get(url);
    console.log(getResponse.data);
    dispatch(setDataSource(getResponse.data.data));
    dispatch(setTotalPage(getResponse.data.totalPages));
    dispatch(setLoading(false));
    return getResponse;
  } catch (error) {
    throw error;
  }
};

const InputComponent = ({ column }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    dispatch(setSearchField(column));
    dispatch(setSearchValue(inputValue));
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
  const uniqueIdentifier = useSelector(unique_identifier);
  const dataSource = useSelector(data_source);
  const selectedPage = useSelector(selected_page);
  const selectedLimit = useSelector(selected_limit);
  const sortDirection = useSelector(sort_direction);
  const sortField = useSelector(sort_field);
  const searchField = useSelector(search_field);
  const searchValue = useSelector(search_value);
  const filterField = useSelector(filter_field);
  const filterValues = useSelector(filter_values);
  const loading = useSelector(loading_state);
  const totalPages = useSelector(total_pages);
  const fetchData = async () => {
    dispatch(setLoading(true));
    try {
      const params = {
        unique_identifier: uniqueIdentifier,
        page: selectedPage,
        limit: selectedLimit,
        sortField: sortField,
        sort: sortDirection,
        searchField: searchField,
        searchValue: searchValue,
        filterField: filterField,
        filterValues: filterValues,
      };

      const queryString = Object.entries(params)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const url = `http://192.168.2.194:3000/api/file_upload?${queryString}`;

      const getResponse = await axios.get(url);
      console.log(getResponse.data);
      dispatch(setDataSource(getResponse.data.data));
      dispatch(setTotalPage(getResponse.data.totalPages));
      dispatch(setLoading(false));
      return getResponse;
    } catch (error) {
      throw error;
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (uniqueIdentifier) {
      fetchData();
    }
  }, [uniqueIdentifier, selectedPage, selectedLimit, sortDirection, sortField]);

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
  const dynamicColumns =
    dataSource.length > 0
      ? Object.keys(dataSource[0]).map((key) => {
          let fixedValue = null;

          const handleSortClick = async (key) => {
            if (sortDirection == "asc") {
              dispatch(setSortDirection("desc"));
              dispatch(setSortField(key));
            } else {
              dispatch(setSortDirection("asc"));
              dispatch(setSortField(key));
            }
          };
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
                      <FilterTabs
                        dataIndex={key}
                        setDataSource={setDataSource}
                      />
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
        })
      : [];
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
    dispatch(setSelectedPage(page));
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
                total: totalPages * 10,
                onShowSizeChange: (current, pageSize) =>
                  dispatch(setSelectedLimit(pageSize)),
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
