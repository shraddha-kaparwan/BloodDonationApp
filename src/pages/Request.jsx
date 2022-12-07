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

  const clearRequest = () => {
    setUserRequest(null);
  };

  const deleteDocument = async () => {
    try {
      setLoading(true);
      await deleteUserRequest(userRequest.id);
      clearRequest();
      setError("");
      // setForm(emptyForm);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setLoading(false);
    }
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
      <div className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
        <a href="/">
          <h1 className="text-2xl text-red-700">Back</h1>
        </a>
        <br></br>
        <h1  className="text-2xl text-gray-700">{user.email}</h1>
        <p  className="text-2xl text-gray-700">Name: {userRequest.name}</p>
        <p  className="text-2xl text-gray-700">City: {userRequest.city}</p>
        <p  className="text-2xl text-gray-700">Blood Group: {userRequest.bloodGroup}</p>
        <p  className="text-2xl text-gray-700">Recieve Date: {userRequest.recieveDate}</p>
        <p  className="text-2xl text-gray-700">Reason: {userRequest.reason}</p>
        <section className="mt-10">
        <form className="flex flex-col">
          <div className="flex mb-6 pt-3 rounded">
            <button className="w-full fill-current bg-green-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center"  onClick={openEditor}>EDIT</button>
          </div>
          <div className="flex mb-6 pt-3 rounded">
            <button className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" onClick={deleteDocument}>DELETE</button>
          </div>
        </form>  
      </section> 
      </div>
    );

  return (
    <div className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
      <a href="/profile">
          <h1 className="text-2xl text-red-700">Profile</h1>
        </a>
        <br></br>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: "12px",
        }}
      >
        <h1  className="text-2xl text-gray-700">Blood Request</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Name</label>
        <input
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          type='text'
          value={form.name}
          onChange={(e) => {
            setForm({
              ...form,
              name: e.target.value,
            });
          }}
        />
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">City</label>
        <select
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
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
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Recieve Date</label>
        <input
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          type='date'
          value={form.recieveDate}
          onChange={(e) => {
            setForm({
              ...form,
              recieveDate: e.target.value,
            });
          }}
        />
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Blood Group</label>
        <select
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
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
        
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Reason</label>
        <textarea
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          value={form.reason}
          onChange={(e) => {
            setForm({
              ...form,
              reason: e.target.value,
            });
          }}
        />
        
        
        {!editor ? (
          <input className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" type='submit' value='SUBMIT' />
        ) : (
          <input className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" type='submit' value='EDIT' />
        )}
      </form>
    </div>
  );
};

export default Request;
