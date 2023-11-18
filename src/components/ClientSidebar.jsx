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
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function ClientSidebar() {
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
                            <span className="ml-1 text-black text-2xl font-extralight truncate">Pharma</span>
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
                                href="/"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <DashboardOutlinedIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        <li className="px-5">

                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-medium tracking-wide text-gray-500">
                                    Metrics
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link
                                href="/metrics/"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <ScheduleIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Datos Históricos
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
                                href="/data/providers"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <SettingsSuggestOutlinedIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Administrar Proveedores
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/data/medicines"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <MedicationOutlinedIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Administrar Medicinas
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/data/orders"
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
                                    {/* <Image
                                    src={user.imageUrl}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    alt="pimg"
                                /> */}
                                    <UserButton />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    {user.username}
                                </span>

                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-400 outline rounded-full">
                                    {user.publicMetadata.role}
                                </span>
                            </a>
                        </li>
                        {/* <li>
                            <Link
                                href="/data/users"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-black hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
                            >
                                <span className="inline-flex justify-center items-center ml-4">
                                    <AdminPanelSettingsIcon />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">
                                    Modificar Roles y Acceso
                                </span>
                            </Link>
                        </li> */}
                        <li>
                            <SignOutButton />
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}