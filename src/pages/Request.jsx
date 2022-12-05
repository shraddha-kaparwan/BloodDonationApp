import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { processFirebaseErrors } from "../firebase/errors";
import { deleteDoc } from "firebase/firestore";
import {
  db,
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  query,
  where,
  getDocs,
  doc,
} from "../firebase";


const Request = () => {
  const today = new Date();
  const jsonToday = today.toJSON().split("T");
  const [date] = jsonToday;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState(false);

  const [userRequest, setUserRequest] = useState();
  const [requests, setRequests] = useState([]);

  const addRequest = async (request) => {
    if (!request.userId) {
      throw new Error("User id is mandatory");
    }

    // --> firebase --> add...
    await addDoc(collection(db, "requests"), {
      ...request,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  // GET USER PROFILE
  const getUserRequest = async (userId) => {
    if (typeof userId !== "string") {
      throw new Error("user id must be a string");
    }

    const colRef = collection(db, "requests");
    const q = query(colRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      setUserRequest({ ...data, id: doc.id });
    });
  };

  // UPDATE/PUT (SET)
  const editUserRequest = async (request) => {
    if (!request.id) {
      throw new Error("Request needs an id");
    }

    const docRef = doc(db, "requests", request.id);
    await setDoc(docRef, {
      ...request,
      updatedAt: serverTimestamp(),
    });
  };

  // DELETE
  const deleteUserRequest = async (requestId) => {
    const docRef = doc(db, "requests", requestId);
    await deleteDoc(docRef);
  };

  
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    city: "",
    bloodGroup: "",
    recieveDate: date,
    active: true,
    reason: ""
  };

  const [form, setForm] = useState(userRequest ?? emptyForm);


  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      return setError("Name is required");
    }

    if (!form.city) {
      return setError("City is required");
    }

    setError("");

    try {
      setLoading(true);

      if (!editor) {
        await addRequest({
          ...form,
          userId: user.uid,
        });
      }

      if (editor) {
        await editUserRequest({
          ...form,
          userId: user.uid,
        });
      }

      // snapshot === "event listener"
      await getUserRequest(user.uid);
      setEditor(false);
      setLoading(false);
      setError("");
    } catch (err) {
      //   setLoading(false);
      console.log(err);
      setError(processFirebaseErrors(err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getUserRequest(user.uid);
  }, [user, getUserRequest]);

  useEffect(() => {
    if (!user & !userLoading) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  // const setFormWithProfile = async () => {
  // await getUserProfile(user.uid);
  // setForm(userProfile);
  // }

  const openEditor = () => {
    setEditor(true);
    setForm(userRequest);
  };

  const deleteDocument = () => {
    deleteUserRequest(userRequest.id);
    // TODO: After deleting, how do we rerender the component
    // because we want to see empty profile form
  };

  // 1. press on "edit"
  // => change to form
  // => form is not empty
  // => form is full of the data from database
  // submit button

  // 2. press on submit
  // => update the firebase database

  if (loading || userLoading) return <div>loading...</div>;

  if (userRequest && !editor)
    return (
      <div>
        <Link to='/'>Back</Link>
        <h1>{user.email}</h1>
        <p>Name: {userRequest.name}</p>
        <p>City: {userRequest.city}</p>
        <p>Blood Group: {userRequest.bloodGroup}</p>
        <p>Recieve Date: {userRequest.recieveDate}</p>
        <p>Reason: {userRequest.reason}</p>
        <button onClick={openEditor}>Edit</button>
        <button onClick={deleteDocument}>Delete</button>
      </div>
    );

  return (
    <>
      <Link to='/profile'>Profile</Link>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: "12px",
        }}
      >
        <h1>Blood Request</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Name</label>
        <input
          type='text'
          value={form.name}
          onChange={(e) => {
            setForm({
              ...form,
              name: e.target.value,
            });
          }}
        />
        <label>City</label>
        <select
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
          value={form.city}
        >
          <option disabled>Choose...</option>
          <option default value='edmonton'>
            Edmonton
          </option>
          <option value='toronto'>Toronto</option>
          <option value='vancouver'>Vancouver</option>
          <option value='calgary'>Calgary</option>
          <option value='saskatoon'>Saskatoon</option>
        </select>
        <label>Recieve Date</label>
        <input
          type='date'
          value={form.recieveDate}
          onChange={(e) => {
            setForm({
              ...form,
              recieveDate: e.target.value,
            });
          }}
        />
        <label>Blood Group</label>
        <select
          required
          onChange={(e) =>
            setForm({
              ...form,
              bloodGroup: e.target.value,
            })
          }
          value={form.bloodGroup}
        >
          <option disabled>Choose...</option>
          <option value='A+'>A Positive</option>
          <option value='A-'>A Negative</option>
          <option value='B+'>B Positive</option>
          <option value='B-'>B Negative</option>
          <option value='O+'>O Positive</option>
          <option value='O-'>O Negative</option>
          <option value='AB+'>AB Positive</option>
          <option value='AB-'>AB Negative</option>
        </select>
        
        <label>Reason</label>
        <textarea
          value={form.reason}
          onChange={(e) => {
            setForm({
              ...form,
              reason: e.target.value,
            });
          }}
        />
        
        
        {!editor ? (
          <input type='submit' value='SUBMIT' />
        ) : (
          <input type='submit' value='EDIT' />
        )}
      </form>
    </>
  );
};

export default Request;
