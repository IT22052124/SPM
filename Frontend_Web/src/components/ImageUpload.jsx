import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../storage/firebase";

const ImageUpload = ({ downloadURL, setDownloadURL }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const uploadImage = () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
            setIsUploaded(true);
          });
        }
      );
    }
  };

  return (
    <div>
      {!isUploaded && (
        <>
          <input type="file" onChange={handleImageUpload} />
          <button onClick={uploadImage}>Upload</button>
        </>
      )}
      <h3>Upload Progress: {progress}%</h3>
      {downloadURL && <img src={downloadURL} alt="Uploaded" />}
    </div>
  );
};

export default ImageUpload;
