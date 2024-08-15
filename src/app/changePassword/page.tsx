"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { auth } from '@/config/firebase';

const PasswordChange = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const user = auth.currentUser;
            if (user && user.email) {
                const credential = EmailAuthProvider.credential(
                    user.email,
                    currentPassword
                );
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                setMessage('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError('No user is currently signed in');
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <>
            <div className="bg-gradient-to-b from-gray-600 to-black flex justify-center items-center h-screen w-screen">
                <div className="max-w-md w-full p-6 border border-gray-300 rounded bg-gray-800">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">
                        Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange}>
                        <div>
                            <label htmlFor="currentPassword" className="text-sm font-medium block mb-2 text-gray-300">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="newPassword" className="text-sm font-medium block mb-2 text-gray-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="confirmPassword" className="text-sm font-medium block mb-2 text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
                        <button
                            type="submit"
                            className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PasswordChange;
