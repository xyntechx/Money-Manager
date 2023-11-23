"use client";

import pb from "@/app/utils/pb";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
    const router = useRouter();

    const [id, setID] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        await pb.collection("users").authWithPassword(id, password);
        router.push("/");
    };

    return (
        <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
            <h1 className="text-lg font-bold">Money Manager</h1>
            <input
                onChange={(e) => setID(e.currentTarget.value)}
                type="text"
                placeholder="Email/Username"
                className="bg-gray-200 py-2 px-4 w-1/4 rounded-md outline-none border-none"
            />
            <input
                onChange={(e) => setPassword(e.currentTarget.value)}
                type="password"
                placeholder="Password"
                className="bg-gray-200 py-2 px-4 w-1/4 rounded-md outline-none border-none"
            />
            <button
                onClick={() => handleLogin()}
                disabled={id.length < 1 || password.length < 1}
                className="bg-blue-200 py-2 px-4 rounded-md outline-none border-2 border-blue-200 transition-colors hover:bg-transparent disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-300"
            >
                Log In
            </button>
            <p className="text-gray-400 text-sm">
                New to Money Manager?{" "}
                <Link href="/signup" className="underline">
                    Create an account
                </Link>
                !
            </p>
        </main>
    );
};

export default Login;
