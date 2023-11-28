import React from 'react';
import SignOutButton from './SignOutButton';
import Image from 'next/image';

import { useRouter } from 'next/navigation'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { LinearProgress } from '@mui/material';

function KokuaLoader() {

    const router = useRouter()

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white rounded-lg p-8 shadow-md text-center flex flex-col items-center">
                <Image
                    src="/img/KokuaLogo.png"
                    alt="403"
                    width={200}
                    height={200}
                />

                <h1 className="text-2xl font-bold mt-5">
                    Cargando...
                </h1>

                <LinearProgress className="w-full mt-5" />
            
            </div>
        </div>
    );
}

export default KokuaLoader;
