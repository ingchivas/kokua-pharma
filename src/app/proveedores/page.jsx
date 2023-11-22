"use client";
import React, { useState, useEffect } from 'react';
import ClientSidebar from '@/components/ClientSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { CircularProgress } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import NotAllowed from '@/components/NotAllowed';
import { useRouter } from 'next/navigation'
import ProviderSidebar from '@/components/ProviderSidebar';
import { BadgeDelta, Card, Flex, Grid, Col,  Metric, ProgressBar, Text, deltaType, Badge, Title } from "@tremor/react";

import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
} from "@tremor/react";



const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';


export default function proveedorPage() {

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

    if (user.publicMetadata.role !== 'prv') {
        return (
            <NotAllowed />
        )
    }

    const [topMeds, setTopMeds] = useState([]);
    const [orders, setOrders] = useState([]);

    // http://localhost:6969/api/orders/provider/54
    // Gets the orders of the provider with id 54

    const [providerId, setProviderId] = useState(user.publicMetadata.prvID);



    useEffect(() => {
        fetch(`${apiRoute}/api/orders/provider/${providerId}`)
            .then(res => res.json())
            .then(res => {
                setOrders(res);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    // Recieves 
    // [
    //     {
    //       "id": 458,
    //       "medicine": "NEXIUM ",
    //       "medDescription": "Caja con 28 sobres de 2.5 mg granulado Esomeprazol",
    //       "quantity": 625,
    //       "orderDate": "2023-09-12T00:00:00.000Z",
    //       "expectedDelivery": "2023-10-21T00:00:00.000Z",
    //       "status": "Realizado"
    //     },
    //     {
    //       "id": 507,
    //       "medicine": "SIMPONI",
    //       "medDescription": "Caja con pluma precargada con 0.5ml/50mg Golimumab",
    //       "quantity": 890,
    //       "orderDate": "2023-08-24T00:00:00.000Z",
    //       "expectedDelivery": "2023-10-01T00:00:00.000Z",
    //       "status": "Realizado"
    //     },

    // Now we need to get the top 3 medicines that the provider has sold /topMeds/:id

    useEffect(() => {
        fetch(`${apiRoute}/api/orders/topMeds/${user.publicMetadata.prvID}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setTopMeds(res);
            })
            .catch(err => {
                console.error(err);
            });
    }
        , [])

    // Recieves

    // {
    //     "id": 90,
    //     "name": "NEXIUM ",
    //     "medDescription": "Caja con 28 sobres de 2.5 mg granulado Esomeprazol",
    //     "totalOrders": 1
    //   },
    //   {
    //     "id": 112,
    //     "name": "AVELOX",
    //     "medDescription": "Caja con 7 tabletas de 400 mg. Moxifloxacino clorh",
    //     "totalOrders": 1
    //   },
    //   {
    //     "id": 336,
    //     "name": "SIMPONI",
    //     "medDescription": "Caja con pluma precargada con 0.5ml/50mg Golimumab",
    //     "totalOrders": 1
    //   }

    // http://localhost:6969/api/orders/totalQuantity/54

    // Gets the total quantity of medicines sold by the provider with id 54

    const [totalQuantity, setTotalQuantity] = useState([]);

    // Recieves
    // {
    //     "HYZAAR": 729,
    //     "ZYKADIA": 359,
    //     "AVELOX": 111,
    //     "PRISTIQ": 861,
    //     "NEXIUM ": 625,
    //     "SIMPONI": 890
    //   }

    useEffect(() => {
        fetch(`${apiRoute}/api/orders/totalQuantity/${providerId}`)
            .then(res => res.json())
            .then(res => {
                setTotalQuantity(res);
            })
            .catch(err => {
                console.log(err);
            })
    }
        , [])

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
                                Bienvenido, proveedor: {(user.publicMetadata.prvName) ? user.publicMetadata.prvName : user.username}
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>
                        <div className="flex flex-col items-left justify-left py-2">
                            <Grid numItemsMd={3} numItemsLg={4} className="mt-3 gap-1">
                                <Card className="max-w-sm">
                                    <Flex justifyContent="between" alignItems="center">
                                        <Text className='text-xl font-semibold'>Top 3 medicinas (último mes) | {(user.publicMetadata.prvName) ? user.publicMetadata.prvName : user.username}</Text>
                                    </Flex>
                                    {topMeds.map((med) => {
                                        return (
                                            <div className="flex flex-col items-left justify-left py-2">
                                                <Text className='text-lg font-semibold'>{med.name} | ID:{med.id}</Text>
                                                <Text className='text-sm font-light'>{med.medDescription}</Text>
                                                <Text className='text-sm font-medium '>Total de órdenes:{med.totalOrders}</Text>
                                            </div>
                                        )
                                    })}
                                </Card>

                                <Card className="max-w-sm">
                                    <Flex justifyContent="between" alignItems="center">
                                        <Text className='text-xl font-semibold'>Total de medicinas vendidas</Text>
                                    </Flex>
                                    {Object.keys(totalQuantity).map((key) => {
                                        return (
                                            <div className="flex flex-col items-left justify-left py-2">
                                                <Text className='text-lg font-semibold'>{key}</Text>
                                                <Text className='text-sm font-medium '>Cantidad:{totalQuantity[key]}</Text>
                                            </div>
                                        )
                                    })}
                                </Card>
                                <Col numColSpan={1} numColSpanLg={2}>
                                <Card className="max-w-auto">
                                    <Title className="text-xl font-semibold">Últimas Órdenes</Title>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell>Medicina</TableHeaderCell>
                                                <TableHeaderCell>Descripción</TableHeaderCell>
                                                <TableHeaderCell>Cantidad</TableHeaderCell>
                                                <TableHeaderCell>Fecha de orden</TableHeaderCell>
                                                <TableHeaderCell>Fecha de entrega</TableHeaderCell>
                                                <TableHeaderCell>Status</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.map((order) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>{order.medicine}</TableCell>
                                                        <TableCell>{order.medDescription}</TableCell>
                                                        <TableCell>{order.quantity}</TableCell>
                                                        <TableCell>{order.orderDate}</TableCell>
                                                        <TableCell>{order.expectedDelivery}</TableCell>
                                                        <TableCell>{
                                                            (order.status === 'Realizado') ?
                                                            <Badge deltaType="increase">{order.status}</Badge>
                                                            :
                                                            <Badge deltaType="decrease">{order.status}</Badge>
                                                        }</TableCell>

                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>


                                </Card>
                                </Col>
                            </Grid>
                        </div>
                        <div className="flex flex-row items-left justify-left py-2">
                            {/* Graph */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}