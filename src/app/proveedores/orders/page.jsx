"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { useUser } from "@clerk/nextjs";
import NotAllowed from '@/components/NotAllowed';
import { useRouter } from 'next/navigation'
import ProviderSidebar from '@/components/ProviderSidebar';
import { Card, Flex, Grid, Col, Text, Badge, Title, BarChart } from "@tremor/react";
import FlagIcon from '@mui/icons-material/Flag';
import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
} from "@tremor/react";
import ReplayIcon from '@mui/icons-material/Replay';

import { es } from "date-fns/locale";
import SearchIcon from '@mui/icons-material/Search';
import KokuaLoader from '@/components/KokuaLoader';
import MissingAuth from '@/components/MissingAuth';
import { MultiSelect, MultiSelectItem, DateRangePicker, DateRangePickerItem, DateRangePickerValue, TextInput } from "@tremor/react";

import { IconButton, Button, Menu, MenuItem, Icon, Typography } from '@mui/material';


const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';


function ProvOrders() {

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

    const [orders, setOrders] = useState([]);

    // http://localhost:6969/api/orders/provider/54
    // Gets the orders of the provider with id 54

    const [providerId, setProviderId] = useState(user.publicMetadata.prvID);
    const fetchOrders = () => {
        fetch(`${apiRoute}/api/orders/provider/${providerId}`)
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
    }, [providerId]);




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
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 730)),
        to: new Date(),
    });

    const formatDate = (dateString) => dateString.split('T')[0];

    const [filteredOrders, setFilteredOrders] = useState([]);

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

    const [testText, setTestText] = useState('Prueba');


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event, orderId) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrderId(orderId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedOrderId(null);
    };
    
    // router_orders.put('/updateStatus', async (req, res) => {
    //     try {
    //         const { orderID, status } = req.body;

    //         const order = await prisma.ordenes.update({
    //             where: {
    //                 IDOrden: orderID
    //             },
    //             data: {
    //                 Estatus: status
    //             }
    //         });

    //         res.json(order);
    //     } catch (error) {
    //         res.status(500).send({ error: error.message });
    //     }
    // });

    const handleStatusChange = (status) => {
        if (selectedOrderId === null) return;


        fetch(`${apiRoute}/api/orders/updateStatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderID: selectedOrderId,
                status,
            })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                toast.success('Status actualizado');
            })
            .catch(err => {
                console.log(err);
                toast.error('Error al actualizar el status');
            });
    }

    const [selectedOrderId, setSelectedOrderId] = useState(null);


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
                                Órdenes | {(user.publicMetadata.prvName) ? user.publicMetadata.prvName : user.username}
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>

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
                                    <TableHeaderCell>Acciones</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
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
                                        <TableCell>
                                            <Button
                                                id="basic-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={(e) => handleClick(e, order.id)}
                                            >
                                                <Text color="blue">Acciones</Text>
                                            </Button>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                            >
                                                <MenuItem onClick={() => {
                                                    handleStatusChange('Realizado');
                                                    handleClose();
                                                }}>
                                                    <Badge color="green">Realizado</Badge>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    handleStatusChange('Cancelado');
                                                    handleClose();
                                                }}>
                                                    <Badge color="red">Cancelado</Badge>
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProvOrders