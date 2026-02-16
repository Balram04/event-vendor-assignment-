import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('vendor')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        name: username,
        email,
        password,
        role
      }, {
        withCredentials: true
      })

      // Display the message from backend (different for admin vs vendor)
      setSuccess(response.data.message || 'Account created successfully!')
      
      setTimeout(() => {
        navigate('/login')
      }, response.data.requiresProfileSetup ? 4000 : 2000) // Longer delay for vendor to read the message
    } catch (err) {
      console.log('Error response:', err.response)
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Card Container */}
        <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
          {/* Header */}
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-gray-800'>Create Account</h1>
            <p className='text-gray-500 text-sm'>Sign up to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm'>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Username Input */}
            <div className='space-y-2'>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                Username
              </label>
              <input
                type='text'
                id='username'
                name='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter your username'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200'
                required
              />
            </div>

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
                placeholder='Create a password'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200'
                required
              />
            </div>

            {/* Role Selection */}
            {/* <div className='space-y-2'>
              <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
                Role
              </label>
              <select
                id='role'
                name='role'
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 bg-white'
                required
              >
                <option value='vendor'>Vendor</option>
                <option value='admin'>Admin</option>
              </select>
            </div> */}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className='text-center'>
            <Link
              to='/login'
              className='text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline'
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup