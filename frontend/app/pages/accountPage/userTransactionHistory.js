"use client";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef, useState } from "react";
// import TransactionService from '@/app/services/transactionService';
import TransactionService from '../../services/transactionService';
import { useUserAuth } from "../../utils/authContext";

export default function UserTransactionHistory() {

    const [transactionHistory, setTransactionHistory] = useState([]);
    const { user } = useUserAuth();

    useEffect(() => {
        getTransactionHistory(); // Automatically fetch transaction history when component mounts
    }, []); 

    const getTransactionHistory = async () => {
        try {
            const response = await TransactionService.getTransactionByUser(user.uid);
            console.log("Transaction History:", response);
            // Extract only the date part from transaction.date
            const formattedTransactions = response.map(transaction => ({
                ...transaction,
                date: transaction.date.substring(0, 10) // Extracts YYYY-MM-DD part
            }));
            setTransactionHistory(formattedTransactions);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <ul className="mt-4 flex flex-col items-center justify-center">
                {transactionHistory.map(transaction => (
                    <li key={transaction.id} className="border border-gray-300 rounded p-4 mb-4 max-w-[500px]">
                        <p className="text-lg font-semibold">Plan: {transaction.plan}</p>
                        <p className="text-lg">Amount: ${transaction.amount}</p>
                        <p className="text-lg">Date: {transaction.date}</p> {/* Date formatted as YYYY-MM-DD */}
                    </li>
                ))}
            </ul>
        </div>
      );
}