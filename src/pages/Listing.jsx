import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useProfile } from "../context/ProfileContext";
import { processFirebaseErrors } from "../firebase/errors";

const Listing = () => {
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
    clearProfile
  } = useProfile();
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(
    userProfile ?? {
      city: "edmonton",
      donationDate: date,
      available: false,
    }
  );


  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      return setError("Name is required");
    }

    if (!form.city) {
      return setError("City is required");
    }


    try {
      setLoading(true);

      if (!editor) {
        await addProfile({
          ...form,
          userId: user.uid,
        });
      }

      if (editor) {
        await editUserProfile({
          ...form,
          userId: user.uid,
        });
      }

      await getUserProfile(user.uid);
      setEditor(false);
      setLoading(false);
      setError("");
    } catch (err) {
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
      <div className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
        <a href="/">
          <h1 className="text-2xl text-red-700">Back</h1>
        </a>
        <br></br>
        <h1 className="text-2xl text-gray-700">{user.email}</h1>
        <p className="text-2xl text-gray-700">Name: {userProfile.name}</p>
        <p className="text-2xl text-gray-700">City: {userProfile.city}</p>
        <p className="text-2xl text-gray-700">Donation Date: {userProfile.donationDate}</p>
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
          <h1 className="text-2xl text-red-700">Back</h1>
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
        <h1 className="text-2xl text-gray-700">Profile</h1>
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
          <option default value='Edmonton'>
            Edmonton
          </option>
          <option value='toronto'>Toronto</option>
          <option value='vancouver'>Vancouver</option>
          <option value='calgary'>Calgary</option>
          <option value='saskatoon'>Saskatoon</option>
        </select>
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Donation Date</label>
        <input
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          type='date'
          value={form.donationDate}
          onChange={(e) => {
            setForm({
              ...form,
              donationDate: e.target.value,
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

export default Listing;
