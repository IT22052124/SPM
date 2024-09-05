import { useState, useRef } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../storage/firebase";

const ImageUpload = ({ setDownloadURLs, setProgress , setLoading}) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setLoading(true)
    // Automatically trigger the upload when files are selected
    uploadImages(files);
  };

  const uploadImages = (files) => {
    const promises = [];
    setProgress(0); // Reset progress bar

    files.forEach((image) => {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      promises.push(
        new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(prog);
            },
            (error) => {
              console.log(error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                resolve(url);
              })
              setLoading(false);
            }
          );
        })
      );
    });

    Promise.all(promises).then((urls) => {
      setDownloadURLs((prevURLs) => [...prevURLs, ...urls]);
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        multiple
        style={{ display: "none" }} // Hide the file input
      />
      <button onClick={handleClick}>Upload</button>
    </div>
  );
};

export default ImageUpload;
