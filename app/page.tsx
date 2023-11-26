"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/utils/pb";
import { ICollection } from "./utils/types";
import Link from "next/link";

export default function Home() {
    const router = useRouter();

    const [userID, setUserID] = useState("");
    const [userVerified, setUserVerified] = useState(0); // 0: pending, 1: true, 2: false

    const [collections, setCollections] = useState<ICollection[]>([]);
    const [editingCollectionID, setEditingCollectionID] = useState("");
    const [editingCollectionName, setEditingCollectionName] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            if (!pb.authStore.isValid) router.push("/login");
            else {
                await pb.collection("users").authRefresh({ requestKey: null });
                if (pb.authStore.model) {
                    setUserID(pb.authStore.model.id);
                    setUserVerified(pb.authStore.model.verified ? 1 : 2);
                }
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        getCollections();
    }, [userID]);

    const handleLogout = () => {
        pb.authStore.clear();
        router.push("/login");
    };

    const getCollections = async () => {
        const response: ICollection[] = await pb
            .collection("collections")
            .getFullList({
                sort: "-created",
                filter: `user = "${userID}"`,
                requestKey: null,
            });

        setCollections(response);
    };

    const handleCreateCollection = async () => {
        const data = {
            name: "New Collection",
            user: userID,
        };

        await pb.collection("collections").create(data);

        getCollections();
    };

    const handleEditCollection = async (id: string, newName: string) => {
        const data = {
            name: newName,
        };

        await pb.collection("collections").update(id, data);
    };

    const handleDeleteCollection = async (id: string) => {
        await pb.collection("collections").delete(id);

        // TODO: Delete all transactions associated with this collection

        getCollections();
    };

    return (
        <main className="flex min-h-screen w-screen flex-col items-center justify-start gap-y-4 py-10 px-20">
            {userVerified === 2 && (
                <p className="absolute top-[10px] right-[20px] bg-red-400 px-4 py-2 rounded-sm">
                    Please verify your email address
                </p>
            )}

            <div className="grid grid-cols-3 w-full gap-x-4 gap-y-4">
                {collections.map((collection) => (
                    <div
                        className="relative border border-gray-200 rounded-md pt-4 flex flex-col justify-center items-center gap-y-4"
                        key={collection.id}
                    >
                        <button
                            onClick={() =>
                                handleDeleteCollection(collection.id)
                            }
                            className="absolute top-0 right-[5px] font-bold text-red-400"
                        >
                            x
                        </button>
                        <input
                            value={
                                (editingCollectionID === collection.id &&
                                    editingCollectionName) ||
                                collection.name
                            }
                            onFocus={() => {
                                setEditingCollectionID(collection.id);
                                setEditingCollectionName(collection.name);
                            }}
                            onChange={(e) =>
                                setEditingCollectionName(e.currentTarget.value)
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleEditCollection(
                                    collection.id,
                                    editingCollectionName
                                )
                            }
                            onBlur={() =>
                                handleEditCollection(
                                    collection.id,
                                    editingCollectionName
                                )
                            }
                            className="outline-none hover:bg-gray-200 focus:bg-gray-200 p-2 rounded-md transition-colors flex-1 w-11/12 text-center"
                        />
                        <Link
                            href={`/collection/${collection.id}`}
                            className="px-4 py-2 text-center bg-blue-200 w-full rounded-b-md outline-none border-2 border-transparent transition-colors hover:bg-transparent hover:border-black"
                        >
                            View
                        </Link>
                    </div>
                ))}
            </div>

            <button
                onClick={() => handleCreateCollection()}
                className="bg-blue-200 py-2 px-4 rounded-md outline-none border-2 border-transparent transition-colors hover:bg-transparent hover:border-black absolute bottom-[10px]"
            >
                + New Collection
            </button>

            <button
                onClick={() => handleLogout()}
                className="underline text-gray-400 absolute bottom-[10px] right-[20px] transition-colors hover:text-red-400"
            >
                Log Out
            </button>
        </main>
    );
}
