import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setDataSource, setUniqueIdentifier } from "../store/fileUploadSlice";
import React, { useState } from "react";

function File() {
  const [selectedFile, setSelectedFile] = useState(null);
  const uniqueIdentifier = useSelector(
    (state) => state.fileUpload.uniqueIdentifier
  );
  const selected_page = useSelector((state) => state.fileUpload.selectedPage);
  const selected_limit = useSelector((state) => state.fileUpload.selectedLimit);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const dispatch = useDispatch();
  // const handleUpload = async (file) => {
  //   console.log(file);
  //   if (!selectedFile) {
  //     alert("Please select a file to upload.");
  //     return;
  //   }
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", selectedFile);

  //     try {
  //       const uploadResponse = await axios.post(
  //         "http://192.168.2.194:3000/api/file_upload/",
  //         formData
  //       );
  //       dispatch(setUniqueIdentifier(uploadResponse.data.pythonOutput));
  //       return uploadResponse.data.pythonOutput;
  //     } catch (error) {
  //       throw error;
  //     }
  //   } catch (error) {
  //     console.error("File upload failed:", error);
  //   }
  // };
  const handleUpload = async (file) => {
    console.log(file);
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      // Check if there is a previous unique identifier in local storage
      const prevUniqueIdentifier = localStorage.getItem("uniqueIdentifier");

      if (prevUniqueIdentifier) {
        // Delete the previous file using the unique identifier
        try {
          await axios.delete(
            `http://192.168.2.194:3000/api/file_upload?unique_identifier=${prevUniqueIdentifier}`
          );
          console.log(
            `Deleted previous file with unique identifier: ${prevUniqueIdentifier}`
          );
        } catch (deleteError) {
          console.error("Failed to delete previous file:", deleteError);
        }
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadResponse = await axios.post(
          "http://192.168.2.194:3000/api/file_upload/",
          formData
        );
        const newUniqueIdentifier = uploadResponse.data.pythonOutput;
        localStorage.setItem("uniqueIdentifier", newUniqueIdentifier);
        dispatch(setUniqueIdentifier(newUniqueIdentifier + 1));
        setTimeout(() => {
          dispatch(setUniqueIdentifier(newUniqueIdentifier));
        }, 10);
        return newUniqueIdentifier;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
      <button
        className="bg-[#798] text-white py-2 px-4 rounded-md"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}

export default File;
