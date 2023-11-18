"use client";

import Image from 'next/image'
import ClientSidebar from '@/components/ClientSidebar';
import { BadgeDelta, Card, Flex, Grid, Metric, ProgressBar, Text } from "@tremor/react";
import { useState, useEffect } from "react";

export default function Home() {

    // Method to get the data from the API, we get the most critical medicines with low stock
    const [criticalMedicines, setCriticalMedicines] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:6969/api/meds/critical");
            const data = await res.json();
            setCriticalMedicines(data);
        };
        fetchData();
    }
        , []);





    return (
        <>
            <div className="grid grid-cols-5 h-screen mr-5">
                <div className="col-span-1">
                    <ClientSidebar />
                </div>
                <div className="col-span-4">
                    <div className="flex flex-col items-left justify-left py-2">
                        <h1 className="text-2xl font-bold inline-block">
                            Dashboard
                        </h1>
                        {/* Hline */}
                        <div className="border-b-2 border-gray-200"></div>

                    </div>
                    <div className="flex flex-col items-left justify-left py-2">
                        <h1 className="text-xl font-bold inline-block">
                            Medicamentos críticos con bajo stock
                        </h1>

                        <Grid numItemsMd={1} numItemsLg={3} className="mt-3 gap-2">
                            {criticalMedicines.map((medicine) => (
                                <Card key={medicine.IDMedicina} className="bg-white shadow-md rounded-md overflow-hidden">
                                    {/* Medicine Name and Description */}
                                    <div className="p-4">
                                        <Text className="text-xl font-bold mb-2">{medicine.NombreMedicina}</Text>
                                        <Text className="text-sm truncate">{medicine.Descripci_n}</Text>
                                        <Text className="text-sm truncate">ID Medicina: {medicine.IDMedicina}</Text>
                                        <Text className="text-sm truncate">Precio Unitario: ${medicine.Precio_Unitario.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                                    </div>
                                    {/* Inventory Level and Criticality */}
                                    <div className="flex flex-col p-2 justify-center items-center">
                                        {/* Inventory Level */}
                                        <div className="flex flex-col justify-between items-center py-1">
                                            <Text className="text-xs font-bold">Nivel de inventario</Text>
                                            <Text>{medicine.NivelDeInventario}</Text>
                                        </div>
                                        {/* Criticality */}
                                        <div className="flex flex-col justify-between items-center py-1">
                                            <Text className="text-xs font-bold">Criticidad</Text>
                                            <BadgeDelta deltaType="moderateDecrease" className="ml-1 w-auto">
                                                {medicine.Criticidad}
                                            </BadgeDelta>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </Grid>
                    </div>
                </div>
            </div>
        </>
    )
}
