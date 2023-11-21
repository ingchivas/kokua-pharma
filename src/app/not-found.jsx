"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';

function estoEsUn404() {

    const router = useRouter()

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg p-8 shadow-md text-center flex flex-col items-center px-28">
                <Image
                    src="/img/KokuaLogo.png"
                    alt="403"
                    width={200}
                    height={200}
                />

                <h1 className="text-2xl font-bold mt-5">
                    Esto es un 404
                </h1>
                <h2 className="text-xl font-bold mt-5">Regresa a la página principal</h2>
                <Link href="/"
                    className="text-blue-500 hover:text-blue-700 mt-5 border-b-2 border-blue-500 hover:border-blue-700"
                >
                    <HomeIcon className='mr-1'/>

                    Home
                </Link>



                <Image
                    src="/img/happy-monkey-circle.gif"
                    alt="404"
                    width={100}
                    height={100}
                    className='mt-5 rounded-lg shadow-md'
                />
                <p className="text-gray-500 mt-2 text-xs"> Mientras regresas al home, observa estos monitos dando vueltas</p>
                
            </div>
        </div>
    );
}

export default estoEsUn404;
