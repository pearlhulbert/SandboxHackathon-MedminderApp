import ReactDOM from "react-dom/client";
import "../App.css";
import { db, storage } from "../firebase.js";
import {
  doc,
  query,
  collection,
  where,
  getDoc,
  documentId,
  onSnapshot,
  deleteDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
//import { Worker } from '@react-pdf-viewer/core';
// Import the main component
//import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
//import '@react-pdf-viewer/core/lib/styles/index.css';

//import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
//import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { v4 } from "uuid";
import "../styles/event.css";

const EventClick = () => {
  const [isEdit, setIsEdit] = useState(false);
  const notesRef = useRef();
  const [notes, setNotes] = useState("");
  const myCollection = collection(db, "user-events");
  const [imageUpload, setImageUpload] = useState();
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storage, "image/");

  const navigate = useNavigate();
  const [param] = useSearchParams();
  let currId = param.get("id");
  const [event, setEvents] = useState();

  //   const q = query(
  //     collection(db, "user-events"),
  //     where(db.FieldPath.documentId(), "==", currId)
  //   );
  //const querySnapshot = await getDocs(q);
  //   useEffect(() => {
  //     onSnapshot(q, (querySnapshot) => {
  //       setEvents(
  //         querySnapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           item: doc.data(),
  //         }))
  //       );
  //     });
  //   }, [event]);

  const saveNotes = (e) => {
    e.preventDefault();
    setNotes(notesRef.current.value);
    // setDoc();
    setIsEdit(false);
    console.log("saving", isEdit);
  };

  const updateEdit = () => {
    setIsEdit(true);
  };

  const uploadImage = () => {
    if (imageUpload === null) {
      return;
    }
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      console.log(response);
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div>
      <button className="back-button" onClick={() => navigate("/")}>
        Back
      </button>
      <div className="event-header">
        <h1>Covid-19 booster</h1>
        <h2 className="date">January 1st, 2019</h2>
      </div>
      <div className="event-notes">
        <p className="notes" onClick={updateEdit}>
          Notes:
        </p>
        {isEdit ? (
          <form className="event-content">
            <textarea
              className="input-text"
              type="text"
              rows="9"
              cols="97"
              ref={notesRef}
            />
            <br />
            <button
              className="button"
              type="submit"
              onClick={(e) => {
                saveNotes(e);
              }}
            >
              Save
            </button>
          </form>
        ) : (
          <div className="event-content">
            <div className="display-text">{notes}</div>
            <br />
          </div>
        )}
      </div>
      <div className="event-files">
        <p className="files">Files: </p>
        <div className="upload-files">
          <input
            type="file"
            onChange={(e) => {
              setImageUpload(e.target.files[0]);
              uploadImage();
            }}
          />
          {/* <button className="button" onClick={uploadImage}> */}
          {/* Upload Image
          </button> */}
        </div>
        <div className="file-list">
          {imageList.map((url) => {
            return <img className="file-image" src={url}></img>;
          })}
        </div>
      </div>
    </div>
  );
};

export default EventClick;
