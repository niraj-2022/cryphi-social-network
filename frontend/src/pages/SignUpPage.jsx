import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShipWheelIcon } from 'lucide-react';
import { useState } from 'react';
import React from 'react'
import { Link } from 'react-router';
import { signup } from '../lib/api.js';

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const { mutate:signupMutation, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUser"]}),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className='border border-y-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        {/* SignUp Form - Left Side*/}
        <div className='w-full lg:w-1/2 sm:p-8 flex flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='size-9 text-primary'/>
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              CRYPHI
            </span>
          </div>

          {/* Error Message if any */}
          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleSignup}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>
                    Join CRYPHI and start your conversation
                  </p>
                </div>

                <div className='space-y-3'>
                  {/* Full Name*/}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <div className='bg-base-100 shadow-md p-0.99 rounded-full border border-gray-300'>
                      <input
                        type="text"
                        placeholder='John Doe'
                        className='input input-ordered w-full'
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Email*/}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <div className='bg-base-100 shadow-md p-0.99 rounded-full border border-gray-300'>
                      <input 
                        type="email"
                        placeholder='John@gmail.com'
                        className='input input-ordered w-full'
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Password*/}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <div className='bg-base-100 shadow-md p-0.99 rounded-full border border-gray-300'>
                      <input 
                        type="password"
                        placeholder='******'
                        className='input input-ordered w-full'
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value})}
                        required
                      />
                    </div>
                    <p className='text-xs opacity-70 mt-1'>Password must be at least 6 characters long</p>
                  </div>
                  {/*T&C*/}
                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input type="checkbox" className='="checkbox checkbox-sm' required />
                      <span className='text-xs leading-tight'>
                        I agree to the {" "}
                        <span className='text-primary hover:underline'>terms of service</span> and {" "}
                        <span className='text-primary hover:underline'>privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className='btn btn-primary w-full' type='submit'>
                  {isPending ? (
                    <>
                    <span className='loading loading-spinner loading-xs'></span>
                    Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Already have an account? {""}
                    <Link to="/login" className='text-primary hover:underline'>
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SignUp Form - Right Side*/}
        <div className='hidden lg:flex flex-col bg-base-200 w-1/2 p-4 sm:p-8'>
          <div className='max-w-md p-8'>
            {/* Illustration */}
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src='/i.png' alt='Language connection illustration' className='w-full h-full' />
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with others worldwide</h2>
              <p className='opacity-70'>
                Make Friends and chat
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignUpPage
