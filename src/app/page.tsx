'use client'

export default function Home() {

  const login = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      username: { value: string },
      password: { value: string },
    }

    console.log(target.username.value)
    console.log(target.password.value)
  }

  return (
    <div className="flex flex-col items-center mx-auto max-w-5xl p-12">
      <form className="flex flex-col w-96 p-8 space-y-8" onSubmit={login}>
        <h1 className="block mb-4 text-center dark:text-white font-bold text-2xl">Log in to your account</h1>
        <div>
          <label htmlFor="username" className="block dark:text-white text-sm">Username</label>
          <input id="username" type="text" className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-purple-700" />
          <label htmlFor="password" className="block mt-4 dark:text-white text-sm">Password</label>
          <input id="password" type="password" className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-purple-700" />
        </div>
        <button type="submit" className="block h-10 bg-purple-800 hover:bg-purple-700 text-white font-semibold text-sm rounded">Log In</button>
      </form>
    </div>
  )
}
