import { useRef } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../storage/firebase";
import PropTypes from "prop-types";

const ImageUpload = ({ setDownloadURLs, setProgress, setLoading }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
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
                resolve({ url, ref: storageRef }); // Store both URL and reference
              });
              setLoading(false);
            }
          );
        })
      );
    });

    Promise.all(promises).then((filesData) => {
      setDownloadURLs((prevURLs) => [...prevURLs, ...filesData]);
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
      <button
        className={
          "select-none bg-opacity-25 bg-blue-600 rounded-lg border border-blue-300 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-light-blue-700 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        }
        onClick={handleClick}
      >
        Upload
      </button>
    </div>
  );
};

ImageUpload.propTypes = {
  setDownloadURLs: PropTypes.func.isRequired,
  setProgress: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default ImageUpload;
