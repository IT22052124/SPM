import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../storage/firebase";

const ImageUpload = ({ DownloadURLs , setDownloadURLs }) => {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const uploadImages = () => {
    const promises = [];

    images.forEach((image) => {
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
              });
            }
          );
        })
      );
    });

    Promise.all(promises).then((urls) => {
      setDownloadURLs(urls); // Save all the uploaded image URLs
    });
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} multiple />
      <button onClick={uploadImages}>Upload</button>
      <h3>Upload Progress: {progress}%</h3>
    </div>
  );
};

export default ImageUpload;
