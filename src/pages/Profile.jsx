import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useProfile } from "../context/ProfileContext";
import { processFirebaseErrors } from "../firebase/errors";

const Profile = () => {
  const today = new Date();
  const jsonToday = today.toJSON().split("T");
  const [date] = jsonToday;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState(false);

  const {
    addProfile,
    getUserProfile,
    userProfile,
    editUserProfile,
    deleteUserProfile,
    clearProfile,
  } = useProfile();
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    age: "",
    bloodGroup: ""
  };

  const [form, setForm] = useState(userProfile ?? emptyForm);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("sbubmitting");

    const age = parseInt(form.age);

    setError("");

    try {
      setLoading(true);

      if (!editor) {
        await addProfile({
          ...form,
          age,
          userId: user.uid,
        });
      }

      if (editor) {
        await editUserProfile({
          ...form,
          age,
          userId: user.uid,
        });
      }

      // snapshot === "event listener"
      await getUserProfile(user.uid);
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
    if (user) getUserProfile(user.uid);
  }, [user, getUserProfile]);

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
    setForm(userProfile);
  };

  const deleteDocument = async () => {
    try {
      setLoading(true);
      await deleteUserProfile(userProfile.id);
      clearProfile();
      setError("");
      // setForm(emptyForm);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading || userLoading) return <div>loading...</div>;

  if (userProfile && !editor)
    return (
      <div  className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
        <a href="/">
          <h1 className="text-2xl text-red-700">Back</h1>
        </a>
        <br></br>
        <h1 className="text-2xl text-gray-700">{user.email}</h1>
        <p className="text-2xl text-gray-700">Name: {userProfile.name}</p>
        <p className="text-2xl text-gray-700">Age: {userProfile.age}</p>
        <p className="text-2xl text-gray-700">Blood Group: {userProfile.bloodGroup}</p>
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
      <a href="/">
        <h1 className="text-2xl text-gray-700">Back</h1>
      </a>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: "12px",
        }}
      >
      <section>
        <p className="text-2xl text-gray-600 pt-2 text-center">PROFILE</p>
        <br></br>
      </section>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label  className="block text-gray-700 text-sm font-bold mb-2 ml-3">Name</label>
        <input
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          required
          type='text'
          value={form.name}
          onChange={(e) => {
            setForm({
              ...form,
              name: e.target.value,
            });
          }}
        />
        <label  className="block text-gray-700 text-sm font-bold mb-2 ml-3">Age</label>
        <input
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          required
          value={form.age}
          onChange={(e) => {
            setForm({
              ...form,
              age: e.target.value,
            });
          }}
        />
        <label  className="block text-gray-700 text-sm font-bold mb-2 ml-3">Blood Group</label>
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
        {!editor ? (
          <input  className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" type='submit' value='SUBMIT' />
        ) : (
          <input  className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" type='submit' value='EDIT' />
        )}
      </form>
    </div>
  );
};

export default Profile;
