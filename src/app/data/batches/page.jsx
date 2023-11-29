"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Flex, Badge, TextInput, DatePicker, NumberInput,
    MultiSelect, MultiSelectItem, SearchSelect, SearchSelectItem
} from '@tremor/react';
import { useUser } from "@clerk/nextjs";

import ClientSidebar from '@/components/ClientSidebar';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import KokuaLoader from '@/components/KokuaLoader';
import MissingAuth from '@/components/MissingAuth';
import NotAllowed from '@/components/NotAllowed';
import { useRouter } from 'next/navigation'

import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination,
    CardContent, Card,
    Button, Modal, Stack, IconButton,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import Search from '@mui/icons-material/Search';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import { es } from "date-fns/locale";



const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';


export default function LotesManagement() {

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

    const [lotes, setLotes] = useState([]);

    const fetchOrders = () => {
        fetch(`${apiRoute}/api/batch/getBatches`)
            .then((res) => res.json())
            .then(res => {
                const formattedOrders = res.map(order => ({
                    ...order,
                    FechaManufactura: order.FechaManufactura.split('T')[0],
                    FechaExpiraci_n: order.FechaExpiraci_n.split('T')[0],
                }));
                setLotes(formattedOrders);
                setFilteredOrders(formattedOrders);

            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchOrders();
    }
        , []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);

    const [openAdd, setOpenAdd] = useState(false);

    const handleOpenAdd = () => {
        setOpenAdd(true);
    }

    const modalStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    };

    const cardStyle = {
        outline: 'none',
        minWidth: 300,
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
    };




    function CreateLote() {
        const [FechaManufactura, setFechaManufactura] = useState();
        const [FechaExpiraci_n, setFechaExpiraci_n] = useState();
        const [CantidadRecibida, setCantidadRecibida] = useState("");
        const [UbicacionAlmacen, setUbicacionAlmacen] = useState("");
        const [medsList, setMedsList] = useState([]);
        const [providersList, setProvidersList] = useState([]);
        const [providerID, setProviderID] = useState("");
        const [medicineID, setMedicineID] = useState("");

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

        const handleCreateLote = (e) => {
            e.preventDefault();
            const data = {
                IDMedicina: medicineID,
                FechaManufactura,
                FechaExpiraci_n,
                CantidadRecibida,
                UbicacionAlmacen,
                IDProveedor: providerID,
            }

            if (medicineID === "") {
                toast.error('Selecciona una medicina');
                return;
            }

            if (providerID === "") {
                toast.error('Selecciona un proveedor');
                return;
            }

            if (FechaManufactura === "") {
                toast.error('Selecciona una fecha de manufactura');
                return;
            }

            if (FechaExpiraci_n === "") {
                toast.error('Selecciona una fecha de expiración');
                return;
            }

            if (CantidadRecibida === "") {
                toast.error('Ingresa una cantidad recibida');
                return;
            }

            if (UbicacionAlmacen === "") {
                toast.error('Ingresa una ubicación en almacén');
                return;
            }

            fetch(`${apiRoute}/api/batch/registerBatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(res => {
                        toast.success('Lote generado exitosamente');
                        setOpenAdd(false);
                        fetchOrders();
                        setSearchQuery("");
                        setPage(0);

                })
                .catch(err => {
                    console.log(err);
                    toast.error('Error al generar lote');
                });
        }

        return (
            <Modal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                style={modalStyle}
            >
                <Card style={cardStyle} className="w-1/2 h-3/4">
                    <CardContent className="">
                        <Stack direction="row" spacing={2}>
                            <h1 className="text-2xl font-bold inline-block">Registrar Lote</h1>
                            <div className="flex-grow text-right">
                                <IconButton onClick={() => setOpenAdd(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </Stack>
                        <form onSubmit={handleCreateLote}>
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

                            <DatePicker className="w-full mt-3"
                                placeholder="Fecha de Manufactura"
                                onValueChange={(value) => {
                                    if (value) {
                                        const isoDate = value.toISOString();
                                        setFechaManufactura(isoDate);
                                    } else {
                                        // Handle the case where the date is null or undefined
                                        setFechaManufactura("");
                                    }
                                }}
                            />

                            <DatePicker className="w-full mt-3"
                                placeholder="Fecha de Expiración"
                                onValueChange={(value) => {
                                    if (value) {
                                        const isoDate = value.toISOString();
                                        setFechaExpiraci_n(isoDate);
                                    } else {
                                        // Handle the case where the date is null or undefined
                                        setFechaExpiraci_n("");
                                    }
                                }
                                }

                            />
                            <NumberInput className="w-full mt-3"
                                placeholder="Cantidad Recibida"
                                value={CantidadRecibida}
                                onValueChange={(value) => setCantidadRecibida(value)}
                            />

                            <TextInput className="w-full mt-3 mb-5"
                                placeholder="Ubicación en Almacén"
                                value={UbicacionAlmacen}
                                onChange={(e) => setUbicacionAlmacen(e.target.value)}
                            />
                            <Button className="w-full mt-3" variant="contained" type="submit">Registrar Lote</Button>
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
                                Administrar Lotes
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>
                    </div>
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => {
                            toast.success('Lotes actualizados');
                            fetchOrders();
                            setSearchQuery("");
                            setPage(0);
                            
                        }}>
                            <ReplayIcon />
                        </IconButton>
                        <Button variant="outlined" onClick={handleOpenAdd}

                        >Registrar Lote</Button>
                    </Stack>
                    <Stack direction="row" spacing={1} className='mt-5 mb-5'>
                        <TextInput icon={Search}
                            placeholder="Buscar por nombre de medicina"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <MultiSelect placeholder='Filtrar por status'
                            onValueChange={(e) => {
                                if (e.length === 0) {
                                    setFilteredOrders(lotes);
                                } else {
                                    setFilteredOrders(lotes.filter((lote) => {
                                        return e.includes(lote.Expirado);
                                    }));
                                }
                            }
                            }
                            icon={FlagIcon}
                        >

                            <MultiSelectItem value={true}><Badge color="red">Expirado</Badge></MultiSelectItem>
                            <MultiSelectItem value={false}><Badge color="green">No Expirado</Badge></MultiSelectItem>
                        </MultiSelect>


                    </Stack>
                    <CreateLote />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre de Medicina</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Proveedor</TableCell>
                                    <TableCell>Fecha de Manufactura</TableCell>
                                    <TableCell>Fecha de Expiración</TableCell>
                                    <TableCell>Cantidad Recibida</TableCell>
                                    <TableCell>Cantidad Restante</TableCell>
                                    <TableCell>Ubicación en Almacén</TableCell>
                                    <TableCell>Expirado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders
                                    .filter((row) => {
                                        if (searchQuery === "") {
                                            return row
                                        } else if (row.NombreMedicina.toLowerCase().includes(searchQuery.toLowerCase())) {
                                            return row
                                        }
                                    })
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow
                                            key={row.IDLote}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                {row.IDLote}
                                            </TableCell>
                                            <TableCell>
                                                {row.NombreMedicina}
                                            </TableCell>
                                            <TableCell>{row.Descripci_n}</TableCell>
                                            <TableCell>{row.NombreProveedor}</TableCell>
                                            <TableCell>{row.FechaManufactura}</TableCell>
                                            <TableCell>{// If fecha de expiracion es menor a la fecha actual, entonces es expirado, poner la fecha en un badge tojo
                                                row.FechaExpiraci_n < new Date().toISOString().split('T')[0] ? <Badge color="red">{row.FechaExpiraci_n}</Badge> : <Badge color="green">{row.FechaExpiraci_n}</Badge>
                                            }</TableCell>

                                            <TableCell>{row.CantidadRecibida}</TableCell>
                                            <TableCell>{row.CantidadRestante}</TableCell>
                                            <TableCell>{row.UbicacionAlmacen}</TableCell>
                                            <TableCell>{row.Expirado ? <Badge color="red">Expirado</Badge> : <Badge color="green">No Expirado</Badge>}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={lotes.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                <ToastContainer />
                </div>
            </div>
        </>
    );
}
