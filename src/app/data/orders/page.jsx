"use client";
import React, { useState, useEffect } from 'react';
import ClientSidebar from '@/components/ClientSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { useUser } from "@clerk/nextjs";
import NotAllowed from '@/components/NotAllowed';
import MissingAuth from '@/components/MissingAuth';
import KokuaLoader from '@/components/KokuaLoader';

import {
    Table, Card, Flex, Grid, Col, Text, Badge, Title, BarChart,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell, MultiSelect, MultiSelectItem, DateRangePicker, DateRangePickerItem, DateRangePickerValue, TextInput
} from "@tremor/react";

import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';

import { es } from "date-fns/locale";

import { IconButton, Button, Menu, MenuItem, Icon, Typography } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';



import { useRouter } from 'next/navigation'


const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';


export default function OrderManagement() {

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

    if (user.publicMetadata.role === 'prv') {
        router.push('/proveedores')
    }


    if (user.publicMetadata.role !== 'whm') {
        return (
            <NotAllowed />
        )
    }

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const fetchOrders = () => {
        fetch(`${apiRoute}/api/orders/getAll`)
            .then(res => res.json())
            .then(res => {
                const formattedOrders = res.map(order => ({
                    ...order,
                    orderDate: order.orderDate.split('T')[0],
                    expectedDelivery: order.expectedDelivery.split('T')[0],
                })).sort((a, b) => {
                    if (a.status === 'Agendado') return -1;
                    if (b.status === 'Agendado') return 1;
                    return 0;
                });
                setOrders(formattedOrders);
                setFilteredOrders(formattedOrders);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 730)),
        to: new Date(),
    });

    const formatDate = (dateString) => dateString.split('T')[0];

    

    const filterOrdersByDate = () => {
        const filtered = orders.filter(order => {
            const orderDate = new Date(formatDate(order.orderDate));
            return orderDate >= new Date(dateRange.from) && orderDate <= new Date(dateRange.to);
        });
        setFilteredOrders(filtered);
    };

    useEffect(() => {
        filterOrdersByDate();
    }, [dateRange, orders]);



    return (
        <>
            <div className="grid grid-cols-5 h-screen mr-5">
                <div className="col-span-1">
                    <ClientSidebar />
                </div>
                <div className="col-span-4">
                    <div className="flex flex-col items-left justify-left py-2">
                        <Flex justifyContent="between" alignItems="center">
                            <h1 className="text-2xl font-bold inline-block">
                                Órdenes
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>
                    </div>

                    <Grid numItemsMd={3} numItemsLg={3} className="mt-3 gap-1">
                        <div className="flex flex-row justify-between">
                            <IconButton onClick={() => {
                                fetchOrders();
                                setDateRange({
                                    from: new Date(new Date().setDate(new Date().getDate() - 730)),
                                    to: new Date(),
                                });
                            }}>
                                <ReplayIcon />
                            </IconButton>
                            <TextInput icon={SearchIcon} placeholder="Filtrar por medicina ordenada" className="max-w-md mx-auto"
                                onChange={(e) => {
                                    setTestText(e.target.value);
                                    const filtered = orders.filter(order => order.medicine.toLowerCase().includes(e.target.value.toLowerCase()));
                                    setFilteredOrders(filtered);
                                }}
                            />

                        </div>


                        <MultiSelect
                            className="max-w-md mx-auto"
                            placeholder="Filtrar por status"
                            icon={FlagIcon}
                            onValueChange={(value) => {
                                const filtered = orders.filter(order => value.includes(order.status));
                                setFilteredOrders(filtered);
                                if (value.length === 0) {
                                    setFilteredOrders(orders);
                                    return;
                                }
                            }
                            }
                        >
                            <MultiSelectItem value="Realizado"><Badge color="green">Realizado</Badge></MultiSelectItem>
                            <MultiSelectItem value="Agendado"><Badge color="yellow">Agendado</Badge></MultiSelectItem>
                            <MultiSelectItem value="Cancelado"><Badge color="red">Cancelado</Badge></MultiSelectItem>
                        </MultiSelect>

                        <DateRangePicker
                            className="max-w-xl mx-auto"
                            value={dateRange}
                            onValueChange={setDateRange}
                            locale={es}
                            selectPlaceholder='Seleccione un rango de fechas'
                            color='rose'
                            enableClear={false}
                        >
                            <DateRangePickerItem
                                key="today"
                                value="today"
                                from={new Date()}
                                to={new Date()}
                                label="Hoy"
                            >
                                Hoy
                            </DateRangePickerItem>
                            <DateRangePickerItem
                                key="yesterday"
                                value="yesterday"
                                from={new Date(new Date().setDate(new Date().getDate() - 1))}
                                to={new Date(new Date().setDate(new Date().getDate() - 1))}
                                label="Ayer"
                            >
                                Ayer
                            </DateRangePickerItem>
                            <DateRangePickerItem
                                key="last7days"
                                value="last7days"
                                from={new Date(new Date().setDate(new Date().getDate() - 7))}
                                to={new Date()}
                                label="Últimos 7 días"
                            >
                                Últimos 7 días
                            </DateRangePickerItem>
                            <DateRangePickerItem
                                key="last30days"
                                value="last30days"
                                from={new Date(new Date().setDate(new Date().getDate() - 30))}
                                to={new Date()}
                                label="Últimos 30 días"
                            >
                                Últimos 30 días
                            </DateRangePickerItem>
                            <DateRangePickerItem
                                key="last90days"
                                value="last90days"
                                from={new Date(new Date().setDate(new Date().getDate() - 90))}
                                to={new Date()}
                                label="Últimos 90 días"
                            >
                                Últimos 90 días
                            </DateRangePickerItem>
                            <DateRangePickerItem
                                key="last365days"
                                value="last365days"
                                from={new Date(new Date().setDate(new Date().getDate() - 365))}
                                to={new Date()}
                                label="Últimos 365 días"
                            >
                                Últimos 365 días
                            </DateRangePickerItem>
                            <DateRangePickerItem
                                key="last730days"
                                value="last730days"
                                from={new Date(new Date().setDate(new Date().getDate() - 730))}
                                to={new Date()}
                                label="Últimos 2 años"
                            >
                                Últimos 2 años
                            </DateRangePickerItem>
                        </DateRangePicker>
                    </Grid>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>ID de Pedido</TableHeaderCell>
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
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.medicine}</TableCell>
                                    <TableCell className='truncate overflow-hidden max-w-sm'>{order.medDescription}</TableCell>
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
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}
