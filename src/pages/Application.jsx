import { stringLength } from "@firebase/util";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useProfile } from "../context/ProfileContext";
import { processFirebaseErrors } from "../firebase/errors";

const Application = () => {
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
  } = useProfile();
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(
    userProfile ?? {
      recieveDate: date,
      active: true,
      reason: "",
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

    setError("");

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

  const deleteDocument = () => {
    deleteUserProfile(userProfile.id);
  };


  if (loading || userLoading) return <div>loading...</div>;

  if (userProfile && !editor)
    return (
      <div>
        <h1>{user.email}</h1>
        <p>Name: {userProfile.name}</p>
        <p>City: {userProfile.city}</p>
        <p>Blood Group: {userProfile.bloodGroup}</p>
        <p>Recieve Date: {userProfile.recieveDate}</p>
        <p>Reason: {userProfile.reason}</p>
        <button onClick={openEditor}>Edit</button>
        <button onClick={deleteDocument}>Delete</button>
      </div>
    );

  return (
    <>
      <Link to='/'>Back</Link>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: "12px",
        }}
      >
        <h1>Profile</h1>
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
              about: e.target.value,
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

export default Application;
