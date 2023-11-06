import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input } from "antd";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import axios from "axios";
const EditableContext = React.createContext(null);
import { useSortable } from "@dnd-kit/sortable";
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
// export const EditableCell = ({
//     title,
//     editable,
//     children,
//     dataIndex,
//     record,
//     handleSave,
//     ...restProps
// }) => {
//     const [editing, setEditing] = useState(false);
//     const inputRef = useRef(null);
//     const form = useContext(EditableContext);

//     useEffect(() => {
//         if (editing) {
//             inputRef.current.focus();
//         }
//     }, [editing]);

//     const toggleEdit = () => {
//         setEditing(!editing);
//         form.setFieldsValue({
//             [dataIndex]: record[dataIndex],
//         });
//     };

//     const save = async () => {
//         try {
//             const values = await form.validateFields();
//             toggleEdit();
//             handleSave({
//                 ...record,
//                 ...values,
//             });
//         } catch (errInfo) {
//             // console.log('Save failed:', errInfo);
//         }
//     };

//     let childNode = children;

//     if (editable) {
//         childNode = editing ? (
//             <Form.Item
//                 style={{
//                     margin: 0,
//                 }}
//                 name={dataIndex}
//                 rules={[
//                     {
//                         required: true,
//                         message: `${title} is required.`,
//                     },
//                 ]}
//             >
//                 <Input ref={inputRef} onPressEnter={save} onBlur={save} />
//             </Form.Item>
//         ) : (
//             <div
//                 className="editable-cell-value-wrap"
//                 style={{
//                     paddingRight: 24,
//                     userSelect: 'none', // Add userSelect property to prevent text selection
//                 }}
//                 onClick={toggleEdit}
//             >
//                 {children}
//             </div>
//         );
//     }

//     return <td {...restProps}>{childNode}</td>;
// };

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  const [localRecord, setLocalRecord] = useState({ ...record }); // Use local state to track the record

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
      setLocalRecord({
        ...localRecord, // Use localRecord when calling handleSave
        ...values,
      });
      await axios.patch(
        "http://192.168.2.194:3000/api/file_update/",
        updateData
      );

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
