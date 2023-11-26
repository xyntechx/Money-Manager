"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/utils/pb";
import { ITransaction } from "@/app/utils/types";
import Link from "next/link";

const Collection = ({ params }: { params: { collectionID: string } }) => {
    const router = useRouter();
    const collectionID = params.collectionID;

    const [userID, setUserID] = useState("");
    const [userVerified, setUserVerified] = useState(0); // 0: pending, 1: true, 2: false

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [editingID, setEditingID] = useState("");
    const [editingName, setEditingName] = useState("");
    const [editingAmount, setEditingAmount] = useState(0);
    const [editingDate, setEditingDate] = useState("");
    const [savings, setSavings] = useState(0);

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
        getTransactions();
    }, [userID]);

    const getTransactions = async () => {
        const response: ITransaction[] = await pb
            .collection("transactions")
            .getFullList({
                sort: "created",
                filter: `collection = "${collectionID}"`,
                requestKey: null,
            });

        let totalSavings = 0;
        for (const r of response) {
            if (r.isCredit) totalSavings += r.amount;
            else totalSavings -= r.amount;
        }

        setTransactions(response);
        setSavings(totalSavings);
    };

    const handleCreateTransaction = async () => {
        const data = {
            name: "New Transaction",
            amount: 0,
            isCredit: false,
            date: new Date().toDateString(),
            collection: collectionID,
            user: userID,
        };

        await pb.collection("transactions").create(data);

        getTransactions();
    };

    const handleEditTransaction = async (id: string, data: ITransaction) => {
        await pb.collection("transactions").update(id, data);

        getTransactions();
    };

    const handleDeleteTransaction = async (id: string) => {
        await pb.collection("transactions").delete(id);

        getTransactions();
    };

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-start gap-y-4 py-10 px-20">
            {userVerified === 2 && (
                <p className="absolute top-[10px] right-[20px] bg-red-400 px-4 py-2 rounded-sm">
                    Please verify your email address
                </p>
            )}

            <div className="w-full flex justify-between items-center">
                <Link
                    href="/"
                    className="border-2 p-2 rounded-md transition-colors hover:border-black"
                >
                    &lt; Back
                </Link>
                <p className="text-center">
                    Savings: <span className="font-bold">{savings}</span>
                </p>
            </div>
            <div className="flex flex-col items-center justify-center w-full border rounded-md">
                <div className="w-full grid grid-cols-4 gap-x-4 p-4 pr-8 font-bold">
                    <p className="p-2">Name</p>
                    <p className="p-2">Is Credit</p>
                    <p className="p-2">Amount</p>
                    <p className="p-2">Date</p>
                </div>
                {transactions.map((t) => (
                    <div
                        key={t.id}
                        className={`${
                            t.isCredit ? "bg-green-200" : "bg-red-200"
                        } w-full grid grid-cols-4 gap-x-4 p-4 pr-8 relative`}
                    >
                        <input
                            type="text"
                            value={
                                (editingID === t.id && editingName) || t.name
                            }
                            onFocus={() => {
                                setEditingID(t.id);
                                setEditingName(t.name);
                                setEditingAmount(t.amount);
                                setEditingDate(
                                    `${new Date(t.date).getFullYear()}/${
                                        new Date(t.date).getMonth() + 1
                                    }/${new Date(t.date).getDate()}`
                                );
                            }}
                            onChange={(e) =>
                                setEditingName(e.currentTarget.value)
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleEditTransaction(t.id, {
                                    ...t,
                                    name: editingName,
                                })
                            }
                            onBlur={() =>
                                handleEditTransaction(t.id, {
                                    ...t,
                                    name: editingName,
                                })
                            }
                            className="bg-transparent outline-none border border-transparent transition-colors rounded-md p-2 hover:border-white focus:border-white"
                        />
                        <input
                            type="checkbox"
                            checked={t.isCredit}
                            onChange={() =>
                                handleEditTransaction(t.id, {
                                    ...t,
                                    isCredit: !t.isCredit,
                                })
                            }
                            className="w-fit"
                        />
                        <input
                            type="text"
                            value={
                                (editingID === t.id &&
                                    editingAmount.toString()) ||
                                t.amount
                            }
                            onFocus={() => {
                                setEditingID(t.id);
                                setEditingName(t.name);
                                setEditingAmount(t.amount);
                                setEditingDate(
                                    `${new Date(t.date).getFullYear()}/${
                                        new Date(t.date).getMonth() + 1
                                    }/${new Date(t.date).getDate()}`
                                );
                            }}
                            onChange={(e) =>
                                setEditingAmount(Number(e.currentTarget.value))
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleEditTransaction(t.id, {
                                    ...t,
                                    amount: editingAmount,
                                })
                            }
                            onBlur={() =>
                                handleEditTransaction(t.id, {
                                    ...t,
                                    amount: editingAmount,
                                })
                            }
                            className="bg-transparent outline-none border border-transparent transition-colors rounded-md p-2 hover:border-white focus:border-white"
                        />
                        <input
                            type="text"
                            value={
                                (editingID === t.id && editingDate) ||
                                `${new Date(t.date).getFullYear()}/${
                                    new Date(t.date).getMonth() + 1
                                }/${new Date(t.date).getDate()}`
                            }
                            onFocus={() => {
                                setEditingID(t.id);
                                setEditingName(t.name);
                                setEditingAmount(t.amount);
                                setEditingDate(
                                    `${new Date(t.date).getFullYear()}/${
                                        new Date(t.date).getMonth() + 1
                                    }/${new Date(t.date).getDate()}`
                                );
                            }}
                            onChange={(e) =>
                                setEditingDate(e.currentTarget.value)
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleEditTransaction(t.id, {
                                    ...t,
                                    date: new Date(editingDate).toDateString(),
                                })
                            }
                            onBlur={() =>
                                handleEditTransaction(t.id, {
                                    ...t,
                                    date: new Date(editingDate).toDateString(),
                                })
                            }
                            className="bg-transparent outline-none border border-transparent transition-colors rounded-md p-2 hover:border-white focus:border-white"
                        />

                        <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="absolute right-[10px] font-bold ml-auto mr-auto top-0 bottom-0"
                        >
                            X
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => handleCreateTransaction()}
                    className="p-4 bg-blue-200 w-full rounded-b-md outline-none border-2 border-transparent transition-colors hover:bg-transparent hover:border-black"
                >
                    + New Transaction
                </button>
            </div>
        </main>
    );
};

export default Collection;
