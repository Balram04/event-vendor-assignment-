import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      })
      
      if (data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/vendor')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }
  return (
    <div className='min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Card Container */}
        <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
          {/* Header */}
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-gray-800'>Welcome Back</h1>
            <p className='text-gray-500 text-sm'>Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Email Input */}
            <div className='space-y-2'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200'
                required
              />
            </div>

            {/* Password Input */}
            <div className='space-y-2'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200'
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Don't have an account?</span>
            </div>
          </div>

          {/* Signup Link */}
          <div className='text-center'>
            <Link
              to='/signup'
              className='text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline'
            >
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login