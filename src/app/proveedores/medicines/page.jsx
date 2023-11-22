"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { useUser } from "@clerk/nextjs";
import NotAllowed from '@/components/NotAllowed';
import { useRouter } from 'next/navigation'
import ProviderSidebar from '@/components/ProviderSidebar';
import KokuaLoader from '@/components/KokuaLoader';
import MissingAuth from '@/components/MissingAuth';

import { Card, Flex, Grid, Col, Text, Badge, Title, BarChart } from "@tremor/react";

const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';

function ProvMeds() {

    const { isSignedIn, user, isLoaded } = useUser();
    const router = useRouter()

    if (!isLoaded) {
        return (
            <KokuaLoader />

        )
    }

    if (!isSignedIn) {
        return (
            <MissingAuth />
        )
    }

    if (user.publicMetadata.role !== 'prv') {
        return (
            <NotAllowed />
        )
    }


    return (
        <>
            <div className="grid grid-cols-5 h-screen mr-5">
                <div className="col-span-1">
                    <ProviderSidebar />
                </div>
                <div className="col-span-4">
                    <div className="flex flex-col items-left justify-left py-2">
                        <Flex justifyContent="between" alignItems="center">
                            <h1 className="text-2xl font-bold inline-block">
                                Administrar Medicinas | {(user.publicMetadata.prvName) ? user.publicMetadata.prvName : user.username}
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProvMeds