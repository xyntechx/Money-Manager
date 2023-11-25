"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/utils/pb";
import { ITransaction } from "@/app/utils/types";

const Collection = ({ params }: { params: { collectionID: string } }) => {
    const router = useRouter();
    const collectionID = params.collectionID;

    const [userID, setUserID] = useState("");
    const [userVerified, setUserVerified] = useState(0); // 0: pending, 1: true, 2: false

    const [transactions, setTransactions] = useState<ITransaction[]>([]);

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
                sort: "date",
                filter: `collection = "${collectionID}"`,
                requestKey: null,
            });

        setTransactions(response);
    };

    const handleCreateTransaction = async () => {
        const data = {
            name: "New Transaction",
            amount: 0,
            isCredit: false,
            date: new Date(),
            collection: collectionID,
            user: userID,
        };

        await pb.collection("transactions").create(data);

        getTransactions();
    };

    // const handleEditTransaction = async (id: string, newName: string) => {
    //     const data = {
    //         name: newName,
    //     };

    //     await pb.collection("transactions").update(id, data);
    // };

    const handleDeleteTransaction = async (id: string) => {
        await pb.collection("transations").delete(id);

        getTransactions();
    };

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-start gap-y-4 py-10 px-20">
            {userVerified === 2 && (
                <p className="absolute top-[10px] right-[20px] bg-red-400 px-4 py-2 rounded-sm">
                    Please verify your email address
                </p>
            )}

            {/* // TODO: SUM AMOUNTS (+ for credit, - for debit) */}
            <p className="w-full text-right">Savings: TODO!!!!</p>
            <div className="flex flex-col items-center justify-center w-full border rounded-md">
                <div className="w-full grid grid-cols-4 gap-x-4 p-4 font-bold">
                    <p>Name</p>
                    <p>Is Credit</p>
                    <p>Amount</p>
                    <p>Date</p>
                </div>
                {transactions.map((t) => (
                    <div
                        key={t.id}
                        className={`${
                            t.isCredit ? "bg-green-200" : "bg-red-200"
                        } w-full grid grid-cols-4 gap-x-4 p-4`}
                    >
                        <p>{t.name}</p>
                        <input
                            type="checkbox"
                            checked={t.isCredit}
                            // TODO
                            // onChange={() => handleEditTransaction()}
                            className="w-fit"
                        />
                        <p>{t.amount}</p>
                        <p>
                            {new Date(t.date).getDate()}/
                            {new Date(t.date).getMonth() + 1}/
                            {new Date(t.date).getFullYear()}
                        </p>
                    </div>
                ))}
                <button
                    onClick={() => handleCreateTransaction()}
                    className="p-4 bg-blue-200 w-full rounded-b-md outline-none border-t-2 border-t-blue-200 transition-colors hover:bg-transparent"
                >
                    + New Transaction
                </button>
            </div>
        </main>
    );
};

export default Collection;
