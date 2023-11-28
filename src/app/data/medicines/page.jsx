"use client";
import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flex, Badge } from '@tremor/react';
import { useUser } from "@clerk/nextjs";

import DateTimeDisplay from '@/components/DateTimeDisplay';
import ClientSidebar from '@/components/ClientSidebar';
import NotAllowed from '@/components/NotAllowed';

import { useRouter } from 'next/navigation'

import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, Fade, Checkbox,
    CardContent, Card, Select, MenuItem, FormControl,
    Button, Modal, TextField, Stack, IconButton, InputAdornment, InputLabel
} from '@mui/material';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';

import KokuaLoader from '@/components/KokuaLoader';
import MissingAuth from '@/components/MissingAuth';


const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';


export default function MedsManagement() {

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

    const [meds, setMeds] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchMeds = () => {
        fetch(`${apiRoute}/api/orders/meds`)
            .then(res => res.json())
            .then(data => {
                setMeds(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchMeds();
    }
        , []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const handleOpenAdd = () => {
        setOpenAdd(true);
    }

    const handleOpenDelete = () => {
        setOpenDelete(true);
    }

    const handleOpenUpdate = () => {
        setOpenUpdate(true);
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

    const [selectedMedicine, setSelectedMedicine] = useState(null);



    function AddMedicine() {
        const [NombreMedicina, setNombreMedicina] = useState('');
        const [Descripci_n, setDescripci_n] = useState('');
        const [Precio_Unitario, setPrecio_Unitario] = useState('');
        const [Criticidad, setCriticidad] = useState('');
        const [NivelDeInventario, setNivelDeInventario] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            const newMed = {
                NombreMedicina,
                Descripci_n,
                Precio_Unitario,
                Criticidad,
                NivelDeInventario
            }
            fetch(`${apiRoute}/api/meds/registerMed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMed)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setOpenAdd(false);
                    fetchMeds();
                    toast.success('Medicina agregada exitosamente');
                })
                .catch(err => {
                    console.log(err);
                })
        }

        return (
            <Modal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                style={modalStyle}
            >
                <Card sx={cardStyle}>
                    <CardContent>
                        <Stack direction="row" spacing={2}>
                            <h1 className="text-2xl font-bold inline-block">Agregar Medicina</h1>
                            <div className="flex-grow text-right">
                                <IconButton onClick={() => setOpenAdd(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </Stack>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Nombre de la Medicina"
                                placeholder="Ingrese el nombre de la medicina"
                                variant="outlined"
                                value={NombreMedicina}
                                onChange={(e) => setNombreMedicina(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <TextField
                                label="Descripción de la Medicina"
                                placeholder="Ingrese la descripción de la medicina"
                                variant="outlined"
                                value={Descripci_n}
                                onChange={(e) => setDescripci_n(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <TextField
                                label="Precio de la Medicina"
                                placeholder="Ingrese el precio de la medicina"
                                variant="outlined"
                                value={Precio_Unitario}
                                onChange={(e) => setPrecio_Unitario(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <FormControl fullWidth className='w-full' size='medium'>
                                <InputLabel id="demo-simple-select-standard-label">Criticidad</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={Criticidad}
                                    onChange={(e) => setCriticidad(e.target.value)}
                                    label="Criticidad"
                                    size='medium'
                                >
                                    <MenuItem value="Alto">Alto</MenuItem>
                                    <MenuItem value="Medio">Medio</MenuItem>
                                    <MenuItem value="Bajo">Bajo</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Nivel de Inventario de la Medicina"
                                placeholder="Ingrese el nivel de inventario de la medicina"
                                variant="outlined"
                                value={NivelDeInventario}
                                onChange={(e) => setNivelDeInventario(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <Button variant="outlined" color="success" type="submit">Agregar Medicina</Button>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        )
    }

    function DeleteMedicine({selectedMedicine}) {
        const [id, setId] = useState('');

        useEffect(() => {
            if (selectedMedicine) {
                setId(selectedMedicine.id);
            }
        }, [selectedMedicine]);

        const handleSubmit = (e) => {
            e.preventDefault();
            fetch(`${apiRoute}/api/meds/deleteMed/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setOpenDelete(false);
                    fetchMeds();
                    toast.success('Medicina eliminada exitosamente');
                })
                .catch(err => {
                    console.log(err);
                })
        }

        return (
            <Modal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                style={modalStyle}
            >
                <Card sx={cardStyle}>
                    <CardContent>
                        <Stack direction="row" spacing={2}>
                            <h1 className="text-2xl font-bold inline-block">Eliminar Medicina</h1>
                            <div className="flex-grow text-right">
                                <IconButton onClick={() => setOpenDelete(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </Stack>

                        <form onSubmit={handleSubmit}>

                            <TextField
                                label="ID de la Medicina"
                                placeholder="Ingrese el ID de la medicina"
                                variant="outlined"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                                disabled
                            />
                            <Button variant="outlined" color="error" type="submit">Eliminar Medicina</Button>
                        </form>
                    </CardContent>
                </Card>

            </Modal>
        )
    }

    function UpdateMedicine( {selectedMedicine} ) {
        const [id, setId] = useState('');
        const [NombreMedicina, setNombreMedicina] = useState('');
        const [Descripci_n, setDescripci_n] = useState('');
        const [Precio_Unitario, setPrecio_Unitario] = useState('');
        const [Criticidad, setCriticidad] = useState('');
        const [NivelDeInventario, setNivelDeInventario] = useState('');

        useEffect(() => {
            if (selectedMedicine) {
                setId(selectedMedicine.id);
                setNombreMedicina(selectedMedicine.name);
                setDescripci_n(selectedMedicine.description);
                setPrecio_Unitario(selectedMedicine.price);
                setCriticidad(selectedMedicine.criticality);
                setNivelDeInventario(selectedMedicine.inventoryLevel);
            }
        }, [selectedMedicine]);



        const handleSubmit = (e) => {
            e.preventDefault();
            const updateMed = {
                NombreMedicina,
                Descripci_n,
                Precio_Unitario,
                Criticidad,
                NivelDeInventario
            }
            fetch(`${apiRoute}/api/meds/updateMed/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateMed)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setOpenUpdate(false);
                    fetchMeds();
                    toast.success('Medicina actualizada exitosamente');
                })
                .catch(err => {
                    console.log(err);
                })
        }

        return (
            <Modal
                open={openUpdate}
                onClose={() => setOpenUpdate(false)}
                style={modalStyle}
            >
                <Card sx={cardStyle}>
                    <CardContent>
                        <Stack direction="row" spacing={2}>
                            <h1 className="text-2xl font-bold inline-block">Actualizar Medicina</h1>
                            <div className="flex-grow text-right">
                                <IconButton onClick={() => setOpenUpdate(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </Stack>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="ID de la Medicina"
                                placeholder="Ingrese el ID de la medicina"
                                variant="outlined"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                                disabled
                            />
                            <TextField
                                label="Nombre de la Medicina"
                                placeholder="Ingrese el nombre de la medicina"
                                variant="outlined"
                                value={NombreMedicina}
                                onChange={(e) => setNombreMedicina(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <TextField
                                label="Descripción de la Medicina"
                                placeholder="Ingrese la descripción de la medicina"
                                variant="outlined"
                                value={Descripci_n}
                                onChange={(e) => setDescripci_n(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <TextField
                                label="Precio de la Medicina"
                                placeholder="Ingrese el precio de la medicina"
                                variant="outlined"
                                value={Precio_Unitario}
                                onChange={(e) => setPrecio_Unitario(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <FormControl fullWidth className='w-full' size='medium'>
                                <InputLabel id="demo-simple-select-standard-label">Criticidad</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={Criticidad}
                                    onChange={(e) => setCriticidad(e.target.value)}
                                    label="Criticidad"
                                    size='medium'
                                >
                                    <MenuItem value="Alto">Alto</MenuItem>
                                    <MenuItem value="Medio">Medio</MenuItem>
                                    <MenuItem value="Bajo">Bajo</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Nivel de Inventario de la Medicina"
                                placeholder="Ingrese el nivel de inventario de la medicina"
                                variant="outlined"
                                value={NivelDeInventario}
                                onChange={(e) => setNivelDeInventario(e.target.value)}
                                margin="normal"
                                className='w-full mt-5'
                                size='medium'
                            />
                            <Button variant="outlined" color="success" type="submit">Actualizar Medicina</Button>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        )
    }

    const selectMedicine = (med) => {
        setSelectedMedicine(med);
    };


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
                                Administrar Medicamentos
                            </h1>
                            <DateTimeDisplay />
                        </Flex>
                        <div className="border-b-2 border-gray-200"></div>
                    </div>
                    <AddMedicine />
                    <DeleteMedicine selectedMedicine={selectedMedicine} />
                    <UpdateMedicine selectedMedicine={selectedMedicine} />

                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => {
                            fetchMeds()
                            setSearch('')
                            setPage(0)
                            toast.success('Medicamentos actualizados')
                                ;
                        }}>
                            <ReplayIcon />
                        </IconButton>
                        <Button variant="outlined" onClick={handleOpenAdd}>Agregar Medicina</Button>
                        <Button variant="outlined" color="error" onClick={handleOpenDelete}>Eliminar Medicina</Button>
                        <Button variant="outlined" color="success" onClick={handleOpenUpdate}>Actualizar Medicina</Button>
                    </Stack>
                    <TextField
                        label="Buscar Medicina"
                        placeholder="Ingrese el nombre de la medicina"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)
                            || setPage(0)
                        }
                        margin="normal"
                        className='w-full mt-5'
                        size='medium'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment className='mr-5'>
                                    <BusinessCenterIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ width: '100%' }} className="mt-5">
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell >
                                                <Checkbox
                                                    color="primary"
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                            </TableCell>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Precio</TableCell>
                                            <TableCell>Criticidad</TableCell>
                                            <TableCell>Nivel de Inventario</TableCell>
                                            <TableCell>Proveedores</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {meds
                                            .filter((med) => {
                                                if (search === '') {
                                                    return med;
                                                } else if (med.name.toLowerCase().includes(search.toLowerCase())) {
                                                    return med;
                                                }
                                            })
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((med) => (
                                                <TableRow
                                                    key={med.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >

                                                    <TableCell >
                                                        <Checkbox
                                                            color="primary"
                                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            onChange={() => selectMedicine(med)}                                                        
                                                        />
                                                    </TableCell>
                                                    <TableCell>{med.id}</TableCell>
                                                    <TableCell>{med.name}</TableCell>
                                                    <TableCell>{med.description}</TableCell>
                                                    <TableCell>${med.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</TableCell>
                                                    <TableCell>{
                                                        med.criticality === 'Alto' ?
                                                            <Badge color="red">
                                                                {med.criticality}
                                                            </Badge>
                                                            :
                                                            med.criticality === 'Medio' ?
                                                                <Badge color="yellow" >
                                                                    {med.criticality}
                                                                </Badge>
                                                                :
                                                                <Badge color="green">
                                                                    {med.criticality}
                                                                </Badge>
                                                    }</TableCell>
                                                    <TableCell>{med.inventoryLevel}</TableCell>
                                                    <TableCell>{
                                                        med.providers.length > 0 ?
                                                            med.providers.map((provider) => (
                                                                <div key={provider.id}>{provider.name}</div>
                                                            ))
                                                            :
                                                            "No hay proveedores registrados"
                                                    }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={meds.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
                    <ToastContainer />
                </div>

            </div>
        </>
    );
}
