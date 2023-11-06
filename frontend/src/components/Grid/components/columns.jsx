import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input } from "antd";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import axios from "axios";
const EditableContext = React.createContext(null);
import { useSortable } from "@dnd-kit/sortable";
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
  setTotalPage,
  sort_direction,
  sort_field,
  total_pages,
  unique_identifier,
} from "../../../store/fileUploadSlice";
import { useDispatch, useSelector } from "react-redux";
export const Row = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      }
    ),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9,
        }
      : {}),
  };
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="dragIcon"
      >
        {React.Children.map(children, (child) => {
          if (child.key === "sort") {
            return React.cloneElement(child, {
              children: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HolderOutlined
                    ref={setActivatorNodeRef}
                    style={{
                      fontSize: "1.6em",
                      touchAction: "none",
                      cursor: "move",
                    }}
                    {...listeners}
                  />
                </div>
              ),
            });
          } else {
            return (
              <EditableContext.Provider value={form}>
                {child}
              </EditableContext.Provider>
            );
          }
        })}
      </tr>
    </Form>
  );
};

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const uniqueIdentifier = useSelector(unique_identifier);
  const selectedPage = useSelector(selected_page);
  const selectedLimit = useSelector(selected_limit);
  const sortDirection = useSelector(sort_direction);
  const sortField = useSelector(sort_field);
  const searchField = useSelector(search_field);
  const searchValue = useSelector(search_value);
  const filterField = useSelector(filter_field);
  const filterValues = useSelector(filter_values);
  const loading = useSelector(loading_state);
  const [editing, setEditing] = useState(false);

  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  const [localRecord, setLocalRecord] = useState({ ...record }); // Use local state to track the record
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: localRecord[dataIndex], // Use localRecord for editing
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      function updatedObject(jsonObject) {
        // Check if the input is a valid JSON object
        if (typeof jsonObject === "object" && jsonObject !== null) {
          for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
              const value = jsonObject[key];
              const updatedObj = {
                [key]: !isNaN(Number(value)) ? Number(value) : value,
              };
              setLocalRecord({
                ...localRecord, // Use localRecord when calling handleSave
                ...updatedObj,
              });
              toggleEdit();
              return {
                document_id: localRecord["_id"],
                update_field: key,
                update_value: !isNaN(Number(value)) ? Number(value) : value,
              };
            }
          }
        } else {
          console.log("Input is not a valid JSON object.");
        }
      }

      const updateData = updatedObject(values);

      await axios.patch(
        "http://192.168.2.194:3000/api/file_update/",
        updateData
      );
      setLocalRecord({
        ...localRecord, // Use localRecord when calling handleSave
        ...values,
      });
      fetchData();

      toggleEdit();
      handleSave({
        ...localRecord, // Use localRecord when calling handleSave
        ...values,
      });
    } catch (errInfo) {
      // Handle validation errors
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          userSelect: "none",
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
