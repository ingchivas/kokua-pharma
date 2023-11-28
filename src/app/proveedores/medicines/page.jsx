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

import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    TextInput,
} from "@tremor/react";
import SearchIcon from '@mui/icons-material/Search';
import ReplayIcon from '@mui/icons-material/Replay';
import { IconButton, Button, Menu, MenuItem, Icon, Typography } from '@mui/material';


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

    const [providerId, setProviderId] = useState(user.publicMetadata.prvID);

    const [medicines, setMedicines] = useState([]);

    const fetchMeds = () => {
        fetch(`${apiRoute}/api/orders/meds/${providerId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setMedicines(data);
                setFilteredMeds(data);
            });
    }

    useEffect(() => {
        fetchMeds();
    }
        , [providerId]);


    // Recieves 
    // [
    //     {
    //       "IDMedicina": 372,
    //       "NombreMedicina": "HYZAAR",
    //       "Descripci_n": "Caja con 15 grageas de 100/12.5 mg. Losartan/Hidroclorotiazida",
    //       "Precio_Unitario": 638.87,
    //       "Criticidad": "Bajo",
    //       "NivelDeInventario": 45
    //     },
    //     {
    //       "IDMedicina": 494,
    //       "NombreMedicina": "ZYKADIA",
    //       "Descripci_n": "Caja con 150 cápsulas en envase de burbuja con 150 mg. Certinib",
    //       "Precio_Unitario": 105000,
    //       "Criticidad": "Alto",
    //       "NivelDeInventario": 26
    //     },
    //     {
    //       "IDMedicina": 112,
    //       "NombreMedicina": "AVELOX",
    //       "Descripci_n": "Caja con 7 tabletas de 400 mg. Moxifloxacino clorh",
    //       "Precio_Unitario": 769.5,
    //       "Criticidad": "Medio",
    //       "NivelDeInventario": 27
    //     },
    //     {
    //       "IDMedicina": 565,
    //       "NombreMedicina": "PRISTIQ",
    //       "Descripci_n": "Caja con 28 tabletas de 50 mg Desvenlafaxina",
    //       "Precio_Unitario": 1727.62,
    //       "Criticidad": "Medio",
    //       "NivelDeInventario": 6
    //     },
    //     {
    //       "IDMedicina": 90,
    //       "NombreMedicina": "NEXIUM ",
    //       "Descripci_n": "Caja con 28 sobres de 2.5 mg granulado Esomeprazol",
    //       "Precio_Unitario": 434.75,
    //       "Criticidad": "Medio",
    //       "NivelDeInventario": 10
    //     },
    //     {
    //       "IDMedicina": 336,
    //       "NombreMedicina": "SIMPONI",
    //       "Descripci_n": "Caja con pluma precargada con 0.5ml/50mg Golimumab",
    //       "Precio_Unitario": 21478.51167,
    //       "Criticidad": "Medio",
    //       "NivelDeInventario": 84
    //     }
    //   ]

    const [filteredMeds, setFilteredMeds] = useState([]);

    const [testText, setTestText] = useState('');


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
                                Catálogo de Medicinas | {(user.publicMetadata.prvName) ? user.publicMetadata.prvName : user.username}
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>
                        <div className="flex flex-row items-center  mt-5">
                            <IconButton onClick={() => {
                                fetchMeds();
                                setTestText('');
                            }}>
                                <ReplayIcon />
                            </IconButton>
                            <TextInput icon={SearchIcon} placeholder="Filtrar por medicina" className=""
                                onChange={(e) => {
                                    setTestText(e.target.value);
                                    setFilteredMeds(medicines.filter((med) => {
                                        return med.NombreMedicina.toLowerCase().includes(e.target.value.toLowerCase());
                                    }))
                                }}
                            />
                        </div>


                            <Table className='mt-5'>
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell>Medicina</TableHeaderCell>
                                        <TableHeaderCell>Descripción</TableHeaderCell>
                                        <TableHeaderCell>Precio</TableHeaderCell>
                                        <TableHeaderCell>Criticidad</TableHeaderCell>
                                        <TableHeaderCell>Existencias</TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMeds.map((med) => (
                                        <TableRow key={med.IDMedicina}>
                                            <TableCell>{med.NombreMedicina}</TableCell>
                                            <TableCell>{med.Descripci_n}</TableCell>
                                            <TableCell>${med.Precio_Unitario.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</TableCell>
                                            <TableCell>{med.Criticidad}</TableCell>
                                            <TableCell>{med.NivelDeInventario}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </div>

                    </div>
            </div>
        </>
    )
}

export default ProvMeds