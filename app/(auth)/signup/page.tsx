"use client";

import pb from "@/app/utils/pb";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Signup = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const handleSignup = async () => {
        const data = {
            username,
            email,
            emailVisibility: true,
            password,
            passwordConfirm,
        };

        await pb.collection("users").create(data);
        await pb.collection("users").requestVerification(email);

        await pb.collection("users").authWithPassword(email, password);

        router.push("/");
    };

    return (
        <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
            <h1 className="text-lg font-bold">Create Account</h1>
            <input
                onChange={(e) => setEmail(e.currentTarget.value)}
                type="email"
                placeholder="Email"
                className="bg-gray-200 py-2 px-4 w-1/4 rounded-md outline-none border-none"
            />
            <input
                onChange={(e) => setUsername(e.currentTarget.value)}
                type="text"
                placeholder="Username"
                className="bg-gray-200 py-2 px-4 w-1/4 rounded-md outline-none border-none"
            />
            <input
                onChange={(e) => setPassword(e.currentTarget.value)}
                type="password"
                placeholder="Password"
                className="bg-gray-200 py-2 px-4 w-1/4 rounded-md outline-none border-none"
            />
            <input
                onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
                type="password"
                placeholder="Confirm Password"
                className="bg-gray-200 py-2 px-4 w-1/4 rounded-md outline-none border-none"
            />
            <button
                onClick={() => handleSignup()}
                disabled={
                    email.length < 1 ||
                    username.length < 1 ||
                    password.length < 1 ||
                    passwordConfirm.length < 1
                }
                className="bg-blue-200 py-2 px-4 rounded-md outline-none border-2 border-blue-200 transition-colors hover:bg-transparent disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-300"
            >
                Sign Up
            </button>
            <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                    Log in
                </Link>
                !
            </p>
        </main>
    );
};

export default Signup;
