export default function ConfirmResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Password Reset Successful</h2>
        <p className="mb-6 text-gray-600 dark:text-zinc-300">Your password has been reset. You can now sign in with your new password.</p>
        <a href="/login" className="w-full bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90 transition block">Back to Login</a>
      </div>
    </div>
  );
} 