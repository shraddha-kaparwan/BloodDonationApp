import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { processFirebaseErrors } from "../firebase/errors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login({ email, password });
      setLoading(false);

      navigate("/");
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(processFirebaseErrors(err.message));
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <div className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
      <section className="mt-10">
      <a href="/">
        <h1 className="text-2xl text-red-700">Back</h1>
      </a>
      
      <form className="flex flex-col" onSubmit={onSubmit}>
      <section>
        <p className="text-2xl text-gray-600 pt-2 text-center">Sign in to your account.</p>
        <br></br>
      </section>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="mb-6 pt-3 rounded bg-gray-200">
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Email</label>
        <input
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          type='text'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        </div>
        <div className="mb-6 pt-3 rounded bg-gray-200">
        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Password</label>
        <input
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-red-600 transition duration-500 px-3 pb-3"
          type='password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        </div>
        <input className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" type='submit' value='SUBMIT' />
      </form>
      </section>
      <br></br>
      <p text-2xl text-gray-600 pt-2>
        <a href="/register">
        New to our website? <h1 className="text-gray-700">Signup</h1>
        </a>
      </p>
    </div>
  );
};

export default Login;
