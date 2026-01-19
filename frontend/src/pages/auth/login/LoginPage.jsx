import XSvg from '../../../components/svgs/X'
import { Link } from 'react-router-dom'

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };  

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className='fill-white w-3xs' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='flex flex-col gap-4 lg:w-3/4 items-center justify-center' onSubmit={handleSubmit}>
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-white font-extrabold text-4xl'>Log In</h1>
          <label className='input input-neutral'>
            <MdOutlineMail />
            <input
              className='grow'
              type='text'
              name='username'
              placeholder='Username'
              value={formData.username}
              onChange={handleInput}
            />
          </label>
          <label className='input input-neutral'>
            <MdPassword />
            <input
              className='grow'
              type='password'
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleInput}
            />
          </label>
          <button className='btn btn-primary w-full rounded-full mt-4'>Log In</button>
          {isError && <p className='text-red-500'>Invalid username or password</p>}
        </form>
        <div>
          <p className='text-neutral-500 mt-4'>Don't have an account?</p>
          <Link to="/signup">
            <button className='btn btn-primary text-white btn-outline w-full rounded-full mt-2'>Sign Up</button>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default LoginPage