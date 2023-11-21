"use client";
import React, { useState, useEffect } from 'react';
import ClientSidebar from '@/components/ClientSidebar';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, Fade, Checkbox,
    CardContent, Card,
    Button, Modal, TextField, Stack, IconButton, InputAdornment
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';


const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function deleteProveedor(id) {
    fetch(`${apiRoute}/api/prov/deleteProveedor/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((res) => res.json())
        .catch((err) => console.error(err));
}

function addProveedor(nombre, ubicacion, numContacto) {
    fetch(`${apiRoute}/api/prov/registerProveedor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Nombre": nombre,
            "Ubicaci_n": ubicacion,
            "NumContacto": numContacto
        })
    })
        .then((res) => res.json())
        .catch((err) =>
            console.error(err),
        );
}

function updateProveedor(id, nombre, ubicacion, numContacto) {
    fetch(`${apiRoute}/api/prov/updateProveedor/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Nombre": nombre,
            "Ubicaci_n": ubicacion,
            "NumContacto": numContacto
        })
    })
        .then((res) => res.json())
        .catch((err) => console.error(err));
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

export default function ProviderManagement() {
    const [providers, setProviders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProvider, setSelectedProvider] = useState([]);
    const [newSupplier, setNewSupplier] = useState({
        Nombre: '',
        Ubicaci_n: '',
        NumContacto: ''
    });

    const [updateSupplier, setUpdateSupplier] = useState({
        IDProveedor: '',
        Nombre: '',
        Ubicaci_n: '',
        NumContacto: ''
    });

    const [deleteSupplier, setDeleteSupplier] = useState({
        IDProveedor: ''
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const handleOpenUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    const handleSelect = (e, id) => {
        const selectedIndex = selectedProvider.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedProvider, id);
        } else {
            newSelected = newSelected.concat(
                selectedProvider.slice(0, selectedIndex),
                selectedProvider.slice(selectedIndex + 1),
            );
        }

        setSelectedProvider(newSelected);

        if (newSelected.length > 0) {
            const lastSelectedId = newSelected[newSelected.length - 1];
            setDeleteSupplier({ IDProveedor: lastSelectedId });
            setUpdateSupplier({ ...updateSupplier, IDProveedor: lastSelectedId });
        }
        const selectedProviderDetails = providers.find(provider => provider.IDProveedor === id);
        console.log("Selected Provider: ", selectedProviderDetails); // Add this line for debugging

        if (selectedProviderDetails) {
            setUpdateSupplier({
                IDProveedor: selectedProviderDetails.IDProveedor,
                Nombre: selectedProviderDetails.Nombre,
                Ubicaci_n: selectedProviderDetails.Ubicaci_n,
                NumContacto: selectedProviderDetails.NumContacto
            });
        }
    };




    const handleChange = (e) => {
        setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
    };

    const handleChangeUpdate = (e) => {
        setUpdateSupplier({ ...updateSupplier, [e.target.name]: e.target.value });
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        console.log(updateSupplier);
        updateProveedor(
            updateSupplier.IDProveedor,
            updateSupplier.Nombre,  // Changed from 'nombre'
            updateSupplier.Ubicaci_n,  // Changed from 'ubicacion'
            updateSupplier.NumContacto  // Changed from 'numContacto'
        );
        handleCloseUpdate();
        toast.success('Proveedor actualizado con éxito');
    };

    const handleChangeDelete = (e) => {
        setDeleteSupplier({ ...deleteSupplier, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        addProveedor(newSupplier.nombre, newSupplier.ubicacion, newSupplier.numContacto);
        handleClose();
        toast.success('Proveedor añadido con éxito');
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        deleteProveedor(deleteSupplier.IDProveedor);
        handleCloseDelete();
        toast.success('Proveedor eliminado con éxito');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiRoute}/api/prov/getProveedores`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProviders(data);
                console.log(data);
            } catch (error) {
                toast.error('Error al obtener proveedores');
                console.error('Fetch error:', error);
            }
        };
        fetchData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <div className="grid grid-cols-5 h-screen mr-5">
                <div className="col-span-1">
                    <ClientSidebar />
                </div>
                <div className="col-span-4">
                    <div className="">
                        <div className="flex flex-col items-left justify-left py-2">
                            <h1 className="text-2xl font-bold inline-block">Administrar Proveedores </h1>
                        </div>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={handleOpen}>Añadir Proveedor</Button>
                            <Button variant="outlined" color="error" onClick={handleOpenDelete}>Eliminar Proveedor</Button>
                            <Button variant="outlined" color="success" onClick={handleOpenUpdate}>Actualizar Proveedor</Button>
                        </Stack>
                        <TextField
                                label="Buscar Proveedor"
                                placeholder="Ingrese el nombre del proveedor"
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        indeterminate={selectedProvider.length > 0 && selectedProvider.length < providers.length}
                                                        checked={providers.length > 0 && selectedProvider.length === providers.length}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                const allProviderIds = providers.map(p => p.IDProveedor);
                                                                setSelectedProvider(allProviderIds);
                                                            } else {
                                                                setSelectedProvider([]);
                                                            }
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell>ID</TableCell>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Ubicación</TableCell>
                                                <TableCell>Número de Contacto</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {providers
                                                .filter((row) => row.Nombre.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => (
                                                    <TableRow key={row.IDProveedor}>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                color="primary"
                                                                checked={selectedProvider.includes(row.IDProveedor)}
                                                                onChange={(e) => handleSelect(e, row.IDProveedor)}
                                                            />

                                                        </TableCell>
                                                        <TableCell>{row.IDProveedor}</TableCell>
                                                        <TableCell>{row.Nombre}</TableCell>
                                                        <TableCell>{row.Ubicaci_n}</TableCell>
                                                        <TableCell>{row.NumContacto}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    component="div"
                                    count={providers.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        style={modalStyle}
                    >
                        <Fade in={open}>
                            <Card style={cardStyle}>
                                <CardContent>
                                    <Stack direction="row" spacing={2}>
                                        <h1 className="text-2xl font-bold inline-block">Añadir Proveedor</h1>
                                        <div className="flex-grow text-right">
                                            <IconButton onClick={handleClose} color="error">
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                    </Stack>
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            label="Nombre"
                                            name="nombre"
                                            value={newSupplier.nombre}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Ubicación"
                                            name="ubicacion"
                                            value={newSupplier.ubicacion}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Número de Contacto"
                                            name="numContacto"
                                            value={newSupplier.numContacto}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button type="submit" fullWidth variant="outlined" color="primary" className='mt-5'>
                                            Añadir
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Modal>

                    <Modal
                        open={openUpdate}
                        onClose={handleCloseUpdate}
                        style={modalStyle}
                    >
                        <Fade in={openUpdate}>
                            <Card style={cardStyle}>
                                <CardContent>
                                    <Stack direction="row" spacing={2}>
                                        <h1 className="text-2xl font-bold inline-block">Actualizar Proveedor</h1>
                                        <div className="flex-grow text-right">
                                            <IconButton onClick={handleCloseUpdate} color="error">
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                    </Stack>
                                    <form onSubmit={handleSubmitUpdate}>
                                        <TextField
                                            label="ID"
                                            name="IDProveedor"
                                            value={updateSupplier.IDProveedor}
                                            onChange={handleChangeUpdate}
                                            fullWidth
                                            margin="normal"
                                            disabled
                                        />

                                        <TextField
                                            label="Nombre"
                                            name="Nombre"
                                            value={updateSupplier.Nombre}
                                            onChange={handleChangeUpdate}
                                            fullWidth
                                            margin="normal"
                                        />

                                        <TextField
                                            label="Ubicación"
                                            name="Ubicaci_n"  // Changed from 'ubicacion'
                                            value={updateSupplier.Ubicaci_n}
                                            onChange={handleChangeUpdate}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Número de Contacto"
                                            name="NumContacto"
                                            value={updateSupplier.NumContacto}
                                            onChange={handleChangeUpdate}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button type="submit" fullWidth variant="outlined" color="success" className='mt-5'>
                                            Actualizar
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Modal>

                    <Modal
                        open={openDelete}
                        onClose={handleCloseDelete}
                        style={modalStyle}
                    >
                        <Fade in={openDelete}>
                            <Card style={cardStyle}>
                                {/* The ID must be obtained from the selected provider */}
                                <CardContent>
                                    <Stack direction="row" spacing={2}>
                                        <h1 className="text-2xl font-bold inline-block">Eliminar Proveedor</h1>
                                        <div className="flex-grow text-right">
                                            <IconButton onClick={handleCloseDelete} color="error">
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                    </Stack>
                                    <form onSubmit={handleSubmitDelete}>
                                        <TextField
                                            label="ID"
                                            name="IDProveedor"
                                            value={deleteSupplier.IDProveedor}
                                            onChange={handleChangeDelete}
                                            fullWidth
                                            margin="normal"
                                            disabled
                                        />
                                        <Button type="submit" fullWidth variant="outlined" color="error" className='mt-5'>
                                            Confirmar Eliminar
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Modal>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}
