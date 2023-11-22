"use client";
import React, { useState, useEffect } from 'react';
import ClientSidebar from '@/components/ClientSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flex } from '@tremor/react';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { CircularProgress } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import NotAllowed from '@/components/NotAllowed';
import { useRouter } from 'next/navigation'


const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';


export default function LotesManagement() {

    const { isSignedIn, user, isLoaded } = useUser();
    const router = useRouter()

    if (!isLoaded) {
        return (
            <div className=" flex flex-col top-0 left-0 w-auto items-center justify-center h-full border-r text-black mr-5 bg-gray-100">
                <CircularProgress />
            </div>

        )
    }

    if (!isSignedIn) {
        return (
            <div className=" flex flex-col top-0 left-0 w-auto items-center justify-center h-full border-r text-black mr-5 bg-gray-100">
                <h1 className="text-2xl font-bold inline-block">
                    Debes iniciar sesión
                </h1>
            </div>
        )
    }

    if (user.publicMetadata.role === 'prv') {
        router.push('/proveedores')
    }


    if (user.publicMetadata.role !== 'whm') {
        return (
            <NotAllowed />
        )
    }

    return (
        <>
            <div className="grid grid-cols-5 h-screen mr-5">
                <div className="col-span-1">
                    <ClientSidebar />
                </div>
                <div className="col-span-4">
                    <div className="flex flex-col items-left justify-left py-2">
                        <Flex justifyContent="between" alignItems="center">
                            <h1 className="text-2xl font-bold inline-block">
                                Administrar Lotes
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>

                    </div>
                </div>
            </div>
        </>
    );
}
