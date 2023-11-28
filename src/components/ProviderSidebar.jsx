"use client";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import SignOutButton from "./SignOutButton";
import { CircularProgress } from "@mui/material";
import {
    UserButton,
} from "@clerk/nextjs";

import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

export default function ProviderSidebar() {
    const { isSignedIn, user, isLoaded } = useUser();
    if (!isLoaded) {
        return (
            <div className=" flex flex-col top-0 left-0 w-auto items-center justify-center h-full border-r text-black mr-5 bg-gray-100">
                <CircularProgress />
            </div>

        )
    }
    if (isSignedIn) {
        return (
            <div className=" flex flex-col top-0 left-0 w-auto h-full border-r text-black mr-5 bg-gray-100">
                <div className="flex items-center justify-center h-14 border-b">
                    <Link href="/">
                        <div className="flex items-center">
                            <Image src="/img/KokuaLogo.png" width={100} height={50} alt="logo" />
                            <span className="ml-1 text-black text-2xl font-extralight truncate">Providers</span>
                        </div>
                        

                    </Link>
                </div>

                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-medium tracking-wide text-gray-500">
                                    Main
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link
                                href="/proveedores"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <DashboardOutlinedIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Home
                                </span>
                            </Link>
                        </li>
                        
                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-medium tracking-wide text-gray-500">
                                    Datos
                                </div>
                            </div>
                        </li>
                        
                        <li>
                            <Link
                                href="/proveedores/medicines"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <MedicationOutlinedIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Catálogo Medicinas
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/proveedores/orders"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <DescriptionOutlinedIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Administrar Órdenes
                                </span>
                            </Link>
                        </li>

                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-medium tracking-wide text-gray-500">
                                    Sesión y Usuarios
                                </div>
                            </div>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <UserButton />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    {user.publicMetadata.prvName ? user.publicMetadata.prvName : user.username}
                                </span>

                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-400 outline rounded-full">
                                    {user.publicMetadata.role}
                                </span>
                            </a>
                            {/* Provider ID */}
                            <a
                                href="#"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-400 font-medium hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <span className="text-sm tracking-wide truncate">
                                        Provider ID: {user.publicMetadata.prvID ? user.publicMetadata.prvID : 'N/A'}
                                    </span>
                                </span>
                            </a>

                        </li>
                        <li>
                            <SignOutButton />
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}