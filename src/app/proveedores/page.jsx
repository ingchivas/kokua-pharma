"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { CircularProgress } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import NotAllowed from '@/components/NotAllowed';
import { useRouter } from 'next/navigation'
import ProviderSidebar from '@/components/ProviderSidebar';
import { Card, Flex, Grid, Col, Text, Badge, Title, BarChart } from "@tremor/react";

import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
} from "@tremor/react";
import KokuaLoader from '@/components/KokuaLoader';
import MissingAuth from '@/components/MissingAuth';

import { DonutChart } from "@tremor/react";

const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';


export default function proveedorPage() {

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

    // Format the date: YYYY-MM-DD of the orderDate and expectedDelivery

    orders.map((order) => {
        order.orderDate = order.orderDate.split('T')[0];
        order.expectedDelivery = order.expectedDelivery.split('T')[0];
    })

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
    // [
    //     {
    //       "medicine": "SIMPONI",
    //       "quantity": 890
    //     },
    //     {
    //       "medicine": "PRISTIQ",
    //       "quantity": 861
    //     },
    //     {
    //       "medicine": "HYZAAR",
    //       "quantity": 729
    //     },
    //     {
    //       "medicine": "NEXIUM ",
    //       "quantity": 625
    //     },
    //     {
    //       "medicine": "ZYKADIA",
    //       "quantity": 359
    //     },
    //     {
    //       "medicine": "AVELOX",
    //       "quantity": 111
    //     }
    //   ]

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

    // Get the orders past due date 
    // localhost:6969/api/orders/pastDeliveryDate/54

    // Recieves
    // {
    //     "id": 168,
    //     "medicine": "ZYKADIA",
    //     "medDescription": "Caja con 150 cápsulas en envase de burbuja con 150 mg. Certinib",
    //     "quantity": 359,
    //     "ammount": 194937,
    //     "orderDate": "2022-08-26T00:00:00.000Z",
    //     "expectedDelivery": "2022-11-30T00:00:00.000Z",
    //     "status": "Agendado"
    //   },

    const [pastDeliveryDate, setPastDeliveryDate] = useState([]);

    useEffect(() => {
        fetch(`${apiRoute}/api/orders/pastDeliveryDate/${providerId}`)
            .then(res => res.json())
            .then(res => {
                setPastDeliveryDate(res);
            })
            .catch(err => {
                console.log(err);
            })
    }
        , [])

    const [missedRevenue, setMissedRevenue] = useState([]);

    useEffect(() => {
        fetch(`${apiRoute}/api/orders/missedRevenue/${providerId}`)
            .then(res => res.json())
            .then(res => {
                setMissedRevenue(res);
            })
            .catch(err => {
                console.log(err);
            })
    }
        , [])

    // Recieves
    // [
    //     {
    //       "revType": "Total",
    //       "revAmount": 973690
    //     },
    //     {
    //       "revType": "Missed",
    //       "revAmount": 936258
    //     }
    //   ]


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
                        <div className="flex flex-col items-left justify-left">
                            <div className="flex flex-wrap mt-3">
                                <div className="max-w-sm h-max lg:w-1/3 xl:w-1/4 px-2">
                                    <Card>
                                        <Flex justifyContent="between" alignItems="center">
                                            <Text className='text-xl font-semibold'>
                                                Top 3 medicinas (último mes)-
                                                {(user.publicMetadata.prvName) ? user.publicMetadata.prvName : user.username}
                                            </Text>
                                        </Flex>
                                        {topMeds.map((med) => (
                                            <div className="flex flex-col items-left justify-left py-2">
                                                <Text className='text-lg font-semibold'>{med.name} | ID:{med.id}</Text>
                                                <Text className='text-sm font-light'>{med.medDescription}</Text>
                                                <Text className='text-sm font-medium'>Total de órdenes: {med.totalOrders}</Text>
                                            </div>
                                        ))}
                                    </Card>
                                </div>
                                <div className="w-full lg:w-2/3 xl:w-3/4 px-2">
                                    <Card className="max-w-full">
                                        <Title className="text-xl font-semibold">Últimas Órdenes</Title>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeaderCell>Medicina</TableHeaderCell>
                                                    <TableHeaderCell>Descripción</TableHeaderCell>
                                                    <TableHeaderCell>Costo</TableHeaderCell>
                                                    <TableHeaderCell>Cantidad</TableHeaderCell>
                                                    <TableHeaderCell>Fecha de orden</TableHeaderCell>
                                                    <TableHeaderCell>Fecha de entrega</TableHeaderCell>
                                                    <TableHeaderCell>Status</TableHeaderCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orders.map((order) => (
                                                    <TableRow>
                                                        <TableCell>{order.medicine}</TableCell>
                                                        <TableCell>{order.medDescription}</TableCell>
                                                        <TableCell>${(order.ammount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</TableCell>
                                                        <TableCell>{order.quantity}</TableCell>
                                                        <TableCell>{order.orderDate}</TableCell>
                                                        <TableCell>{order.expectedDelivery}</TableCell>
                                                        <TableCell>{
                                                            (order.status === 'Realizado') ? <Badge color="green">{order.status}</Badge> :
                                                                (order.status === 'Agendado') ? <Badge color="yellow">{order.status}</Badge> :
                                                                    <Badge color="red">{order.status}</Badge>
                                                        }</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </div>
                            </div>

                            <Grid numItemsMd={4} numItemsLg={4} className="mt-3 gap-1">
                                <Card className="max-w-md">
                                    <Flex justifyContent="between" alignItems="center">
                                        <Text className='text-xl font-semibold'>Medicinas con entrega atrasada</Text>
                                    </Flex>
                                    {
                                        (pastDeliveryDate.length === 0) ? <Text className='text-lg font-semibold'>No hay medicinas con entrega atrasada</Text> :
                                            pastDeliveryDate.map((med) => (
                                                <div className="flex flex-col items-left justify-left py-2">
                                                    <Text className='text-lg font-semibold'>{med.medicine} | Order ID:{med.id}</Text>
                                                    <Text className='text-sm font-light'>{med.medDescription}</Text>
                                                    <Text className='text-sm font-medium'>Fecha de entrega: {med.expectedDelivery.split('T')[0]}</Text>
                                                    <Text className='text-sm font-medium'>Revenue perdido: ${(med.ammount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                                                    <Badge color="red">Atrasado</Badge>

                                                </div>
                                            ))
                                    }
                                    <Text className='text-lg font-semibold'>Total de ordenes con entrega atrasada: {pastDeliveryDate.length}</Text>
                                    <Text className='text-lg font-semibold'>Revenue perdido total: ${(pastDeliveryDate.reduce((a, b) => a + b.ammount, 0)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                                </Card>

                                <Card className="max-w-lg">
                                    <Title>Revenue perdido vs Revenue total</Title>

                                    <DonutChart
                                        className="h-72 mt-4"
                                        data={missedRevenue}
                                        index='revType'
                                        category={'revAmount'}
                                        colors={["green", "red"]}
                                        valueFormatter={
                                            (value) => {
                                                return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
                                            }
                                        }
                                    />

                                </Card>

                                <Col numColSpan={2} numColSpanLg={2}>
                                    <Card className="max-w-auto ml-3">
                                        <Title>Medicinas vendidas (Total de Unidades Venidas a Kokua)</Title>
                                        <BarChart
                                            className="h-72 mt-4"
                                            data={totalQuantity}
                                            index='medicine'
                                            categories={['quantity']}
                                            colors={["blue"]}
                                            valueFormatter={
                                                (value) => {
                                                    return `${value} unidades`
                                                }
                                            }
                                        />
                                    </Card>
                                </Col>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}