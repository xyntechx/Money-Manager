"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/utils/pb";

export default function Home() {
    const router = useRouter();
    const [userVerified, setUserVerified] = useState(0); // 0: pending, 1: true, 2: false

    useEffect(() => {
        const checkAuth = async () => {
            if (!pb.authStore.isValid) router.push("/login");
            else {
                await pb.collection("users").authRefresh({ requestKey: null });
                if (pb.authStore.model)
                    setUserVerified(pb.authStore.model.verified ? 1 : 2);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        pb.authStore.clear();
        router.push("/login");
    };

    return (
        <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
            {userVerified === 2 && (
                <p className="absolute top-[10px] right-[20px] bg-red-400 px-4 py-2 rounded-sm">
                    Please verify your email address
                </p>
            )}

            <h1 className="text-lg font-bold">Dashboard</h1>
            <button
                onClick={() => handleLogout()}
                className="underline text-gray-400 absolute bottom-[10px] right-[20px] transition-colors hover:text-red-400"
            >
                Log Out
            </button>
        </main>
    );
}
