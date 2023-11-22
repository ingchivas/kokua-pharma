import React from 'react';
import SignOutButton from './SignOutButton';
import Image from 'next/image';

import { useRouter } from 'next/navigation'
import LoginIcon from '@mui/icons-material/Login';


function MissingAuth() {

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
                    Debes iniciar sesión primero
                </h1>

                <div className="mt-5">
                    <a
                        href="#"
                        onClick={() => router.push("/sign-in") }
                        className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-blue-600 hover:text-gray-800 border border-blue-600 hover:border-blue-800 pr-6 rounded-xl"
                    >
                        <span className="inline-flex justify-center items-center ml-4 text-blue-600">
                            <LoginIcon />
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                            Iniciar sesión
                        </span>
                    </a>

                </div>
            
            </div>
        </div>
    );
}

export default MissingAuth;
