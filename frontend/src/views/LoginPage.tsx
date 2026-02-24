'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GiStrawberry } from 'react-icons/gi'
import { useAuth } from '@/context/AuthContext'
import { useLogin, useRegister } from '@/lib/hooks/useAuth'
import CustomInput from '@/components/custom/CustomInput'
import CustomButton from '@/components/custom/CustomButton'
import { modal } from '@/utils/modal'

const LoginPage = () => {
  const router = useRouter()
  const { login } = useAuth()
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [regData, setRegData] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginData.email || !loginData.password) {
      modal.error('Please fill all fields')
      return
    }
    try {
      const user = await loginMutation.mutateAsync(loginData)
      login(user)
      modal.success('Welcome back!')
      router.push('/')
    } catch {
      // error toast handled in useLogin onError
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, phone, password, confirm } = regData
    if (!name || !email || !phone || !password || !confirm) {
      modal.error('Please fill all fields')
      return
    }
    if (password !== confirm) {
      modal.error('Passwords do not match')
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      modal.error('Enter valid 10-digit phone')
      return
    }
    try {
      const user = await registerMutation.mutateAsync({ name, email, phone, password })
      login(user)
      modal.success('Account created successfully!')
      router.push('/')
    } catch {
      // error toast handled in useRegister onError
    }
  }

  const loading = loginMutation.isPending || registerMutation.isPending

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left: Decorative */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-themeColor to-themeColorDark text-white p-12">
        <GiStrawberry size={80} className="mb-6 opacity-80" />
        <h2 className="text-3xl font-extrabold mb-3">FreshFruits</h2>
        <p className="text-green-100 text-center text-lg leading-relaxed max-w-xs">
          Farm-fresh fruits delivered daily to your doorstep. Join thousands of happy customers!
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[['500+', 'Customers'], ['50+', 'Fruit types'], ['4.8★', 'Rating']].map(([v, l]) => (
            <div key={l} className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold">{v}</p>
              <p className="text-green-200 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 text-themeColor font-bold text-xl mb-6 lg:hidden">
            <GiStrawberry size={24} /> FreshFruits
          </div>

          <div className="flex rounded-xl border border-gray-200 p-1 mb-7 bg-gray-50">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? 'bg-white text-themeColor shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setTab(t)}
              >
                {t === 'login' ? 'Login' : 'Create Account'}
              </button>
            ))}
          </div>

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
                <p className="text-gray-400 text-sm mt-1">Login to access your account</p>
              </div>
              <CustomInput
                label="Email Address"
                type="email"
                placeholder="rahul@example.com"
                value={loginData.email}
                isRequired
                onValueChange={v => setLoginData(d => ({ ...d, email: v }))}
              />
              <CustomInput
                label="Password"
                isPassword
                placeholder="Enter your password"
                value={loginData.password}
                isRequired
                onValueChange={v => setLoginData(d => ({ ...d, password: v }))}
              />
              <div className="flex justify-end">
                <button type="button" className="text-sm text-themeColor hover:underline">
                  Forgot password?
                </button>
              </div>
              <CustomButton
                text="Login to Account"
                type="submit"
                className="w-full py-3"
                isLoading={loading}
              />
              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <button type="button" className="text-themeColor font-medium hover:underline" onClick={() => setTab('register')}>
                  Register here
                </button>
              </p>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                <p className="text-gray-400 text-sm mt-1">Join FreshFruits today!</p>
              </div>
              <CustomInput label="Full Name" placeholder="Rahul Sharma" value={regData.name} isRequired onValueChange={v => setRegData(d => ({ ...d, name: v }))} />
              <CustomInput label="Email Address" type="email" placeholder="rahul@example.com" value={regData.email} isRequired onValueChange={v => setRegData(d => ({ ...d, email: v }))} />
              <CustomInput label="Phone Number" type="tel" placeholder="9876543210" value={regData.phone} isRequired onValueChange={v => setRegData(d => ({ ...d, phone: v }))} />
              <CustomInput label="Password" isPassword placeholder="Create a strong password" value={regData.password} isRequired onValueChange={v => setRegData(d => ({ ...d, password: v }))} />
              <CustomInput label="Confirm Password" isPassword placeholder="Repeat your password" value={regData.confirm} isRequired onValueChange={v => setRegData(d => ({ ...d, confirm: v }))} />
              <CustomButton text="Create Account" type="submit" className="w-full py-3" isLoading={loading} />
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" className="text-themeColor font-medium hover:underline" onClick={() => setTab('login')}>
                  Login here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
