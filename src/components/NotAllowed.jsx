import React from 'react';
import SignOutButton from './SignOutButton';
import Image from 'next/image';

import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

function NotAllowed() {

    const { signOut, user } = useClerk();
    const router = useRouter()

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg p-8 shadow-md text-center flex flex-col items-center">
                <Image
                    src="/img/KokuaLogo.png"
                    alt="403"
                    width={200}
                    height={200}
                />

                <h1 className="text-2xl font-bold mt-5">
                    No tienes permiso para ver esta página, {user.username}
                </h1>
                <h2 className="text-xl font-bold mt-5">Contacta a tu administrador para obtener acceso</h2>
                <a href="mailto:joseemiliokuri@gmail.com"
                    className="text-blue-500 hover:text-blue-700 mt-5 border-b-2 border-blue-500 hover:border-blue-700"
                >
                    Email de soporte
                </a>

                {/* <Image
                    src="https://media.discordapp.net/attachments/750831694839545886/1174946086654332938/0dff7e81-cfab-4655-90c1-174ae36d7240.png"
                    alt="403"
                    width={100}
                    height={100}
                    className='mt-5 rounded-lg shadow-md'
                />
                <p className="text-gray-500 mt-2 text-xs"> Iara no sabe cómo llegaste aquí, está un poco confundida</p> */}

                <div className="mt-5">
                    <a
                        href="#"
                        onClick={() => signOut(() => router.push("/"))}
                        className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-red-400 hover:text-gray-800 border border-red-400 hover:border-red-600 pr-6 rounded-xl"
                    >
                        <span className="inline-flex justify-center items-center ml-4 text-red-400">
                            <LogoutOutlinedIcon />
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                            Logout
                        </span>
                    </a>

                </div>
            </div>
        </div>
    );
}

export default NotAllowed;
