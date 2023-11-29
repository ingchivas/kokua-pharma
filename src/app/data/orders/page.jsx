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
    Table, Flex, Grid, Badge,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell, MultiSelect, MultiSelectItem, DateRangePicker, DateRangePickerItem, DateRangePickerValue, TextInput
} from "@tremor/react";
import CloseIcon from '@mui/icons-material/Close';
import {
    Box, Paper,
    CardContent, Card,
    Modal, TextField, Stack,
} from '@mui/material';

import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';
import { SearchSelect, SearchSelectItem, NumberInput } from "@tremor/react";

import { es } from "date-fns/locale";

import { IconButton, Button } from '@mui/material';
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
                }));
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

    const [testText, setTestText] = useState('');

    // router_orders.post('/generate', async (req, res) => {
    //     try {
    //         const { providerID, medicineID, quantity } = req.body;

    //         const medicine = await prisma.medicinas.findUnique({
    //             where: {
    //                 IDMedicina: medicineID
    //             }
    //         });

    //         const order = await prisma.ordenes.create({
    //             data: {
    //                 IDProveedor: providerID,
    //                 IDMedicina: medicineID,
    //                 CantidadOrdenada: quantity,
    //                 Costo: medicine.Precio * quantity,
    //                 Estatus: 'Agendado',
    //                 EntregaEsperada: new Date(new Date().setDate(new Date().getDate() + 7))
    //             }
    //         });

    //         res.json(order);
    //     } catch (error) {
    //         res.status(500).send({ error: error.message });
    //     }
    // });

    const [openAdd, setOpenAdd] = useState(false);

    const handleOpenAdd = () => {
        setOpenAdd(true);
    }

    const modalStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const cardStyle = {
        outline: 'none',
        minWidth: 300,
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
    };

    function CreateOrder() {
        const [providerID, setProviderID] = useState('');
        const [medicineID, setMedicineID] = useState('');
        const [quantity, setQuantity] = useState();
        const [medsList, setMedsList] = useState([]);
        const [providersList, setProvidersList] = useState([]);


        useEffect(() => {
            fetch(`${apiRoute}/api/meds/medsNames`)
                .then(res => res.json())
                .then(res => {
                    const formattedMeds = res.map(med => ({
                        ...med,
                        value: med.IDMedicina,
                        label: med.NombreMedicina,
                    }));
                    setMedsList(formattedMeds);
                })
                .catch(err => {
                    console.log(err);
                });
        }, []);

        useEffect(() => {
            fetch(`${apiRoute}/api/prov/nameProveedores`)
                .then(res => res.json())
                .then(res => {
                    const formattedProviders = res.map(provider => ({
                        ...provider,
                        value: provider.IDProveedor,
                        label: provider.Nombre,
                    }));
                    setProvidersList(formattedProviders);
                })
                .catch(err => {
                    console.log(err);
                });
        }, []);

        const handleSubmit = (e) => {
            e.preventDefault();

            if (!providerID || !medicineID || !quantity) {
                toast.error('Todos los campos son requeridos');
                return;
            }


            fetch(`${apiRoute}/api/orders/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    providerID,
                    medicineID,
                    quantity
                })
            })
                .then(res => res.json())
                .then(res => {
                    toast.success('Orden generada exitosamente');
                    setOpenAdd(false);
                    fetchOrders();
                })
                .catch(err => {
                    console.log(err);
                    toast.error('Error al generar orden');
                });
        }

        return (
            <Modal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                style={modalStyle}
            >
                <Card style={cardStyle} className="w-1/2">
                    <CardContent>
                        <Stack direction="row" spacing={2}>
                            <h1 className="text-2xl font-bold inline-block">Generar Orden </h1>
                            <div className="flex-grow text-right">
                                <IconButton onClick={() => setOpenAdd(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </Stack>
                        <form onSubmit={handleSubmit}>
                            <SearchSelect
                                className="w-full mt-3"
                                placeholder="Proveedor"
                                icon={SearchIcon}
                                onValueChange={(value) => {
                                    setProviderID(value);
                                }}
                            >
                                {providersList.map((provider) => (
                                    <SearchSelectItem key={provider.value} value={provider.value}>
                                        {provider.label}
                                    </SearchSelectItem>
                                ))}
                            </SearchSelect>

                            <SearchSelect
                                className="w-full mt-3"
                                placeholder="Medicina"
                                icon={SearchIcon}
                                onValueChange={(value) => {
                                    setMedicineID(value);
                                }}
                            >
                                {medsList.map((med) => (
                                    <SearchSelectItem key={med.value} value={med.value}>
                                        {med.label}
                                    </SearchSelectItem>
                                ))}
                            </SearchSelect>

                            <NumberInput
                                placeholder='Cantidad a ordenar'
                                value={quantity}
                                onValueChange={(e) => setQuantity(e)}
                                className="w-full mt-3 mb-10"
                            />

                            <Button
                                variant="contained"
                                type="submit"
                                className="w-full mt-5"
                            >
                                Generar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        )
    }

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

                    <Button variant="outlined" onClick={
                        () => {
                            handleOpenAdd();
                        }
                    }>Generar Orden</Button>

                    <Grid numItemsMd={3} numItemsLg={3} className="mt-3 gap-1">
                        <div className="flex flex-row justify-between">
                            <IconButton onClick={() => {
                                fetchOrders();
                                setDateRange({
                                    from: new Date(new Date().setDate(new Date().getDate() - 730)),
                                    to: new Date(),
                                });
                                setTestText('');
                                toast.success('Ordenes actualizadas');

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

                    <CreateOrder />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Proveedor</TableHeaderCell>
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
                                    <TableCell className='truncate overflow-hidden max-w-xs'>{order.provider}</TableCell>
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
