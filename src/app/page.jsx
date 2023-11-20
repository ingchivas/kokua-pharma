"use client";

import Image from 'next/image'
import ClientSidebar from '@/components/ClientSidebar';
import { BadgeDelta, Card, Flex, Grid, Metric, ProgressBar, Text, deltaType, Badge } from "@tremor/react";
import { useState, useEffect } from "react";

import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const apiRoute = process.env.NEXT_PUBLIC_API_URL;
const apiRoute2 = process.env.NEXT_PUBLIC_API_URL2;


const DateTimeDisplay = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-semibold text-xl">
            <p>{currentDateTime.toLocaleDateString() + " " + currentDateTime.toLocaleTimeString()}</p>
        </div>
    );
};



export default function Home() {

    // Method to get the data from the API, we get the most critical medicines with low stock
    const [expired, setExpired] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${apiRoute}/api/batch/getExpiredPercentage`);
            const json = await res.json();
            setExpired(json);
        };
        fetchData();
    }
        , []);
    // Recieves
    // {
    //     "expiredPercentage": 28.99,
    //     "expiredPercentagePrevMonth": 26.25,
    //     "total": 400,
    //     "delta": 2.73
    //   }

    const [onTime, setOnTime] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${apiRoute}/api/orders/getOnTime`);
            const json = await res.json();
            setOnTime(json);
        };
        fetchData();
    }
        , []);

    // Recieves

    // {
    //     "onTimePercentage": 100,
    //     "onTimePercentagePrevMonth": 82.7,
    //     "total": 185,
    //     "delta": 17.29
    //   }

    const [leadTime, setLeadTime] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${apiRoute}/api/orders/getLeadTime`);
            const json = await res.json();
            setLeadTime(json);
        };
        fetchData();
    }
        , []);

    // Recieves

    // {
    //     "leadTime": 195.71,
    //     "leadTimePrevMonth": 101.62,
    //     "delta": 94.09
    //   }

    // Set the delta type to be used in the badge decrease, moderateDecrease, unchanged, moderateIncrease, increase
    // based on the delta value
    const deltaType = (delta) => {
        if (delta < 0) {
            return "moderateDecrease";
        } else if (delta > 0) {
            return "moderateIncrease";
        } else {
            return "unchanged";
        }
    }

    const isIncreasePositive = (delta) => {
        if (delta > 0) {
            return true;
        } else {
            return false;
        }
    }

    const [dataGraph, setDataGraph] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${apiRoute2}/data`);
            const json = await res.json();
            setDataGraph(json);
        };
        fetchData();
    }
        , []);

    // Recieves
    // {
    //     "CantidadOrdenada": 1693,
    //     "Criticidad": 0,
    //     "ID": 480,
    //     "acum_percentage": 1.6201577093860051,
    //     "percentage": 1.6201577093860051
    //   },
    //   {
    //     "CantidadOrdenada": 1570,
    //     "Criticidad": 0,
    //     "ID": 256,
    //     "acum_percentage": 3.122607563925892,
    //     "percentage": 1.5024498545398868
    //   },



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
                                Dashboard
                            </h1>
                            <DateTimeDisplay />
                        </Flex>

                        {/* Hline */}
                        <div className="border-b-2 border-gray-200"></div>

                    </div>
                    <div className="flex flex-col items-left justify-left py-2">
                        <Grid numItemsMd={1} numItemsLg={4} className="mt-3 gap-1">
                            <Card className="max-w-sm">
                                <Flex justifyContent="between" alignItems="center">
                                    <Text>Medicinas Expiradas (% - último mes)</Text>
                                </Flex>
                                <Metric>{expired.expiredPercentage}% </Metric>
                                <ProgressBar value={expired.expiredPercentage} className='mt-2' />
                                <Flex justifyContent="between" alignItems="center" className="mt-2">
                                    <Text>Mes Anterior</Text>
                                    <BadgeDelta deltaType={deltaType(expired.delta)} isIncreasePositive={isIncreasePositive(expired.delta)} className='font-semibold'>
                                        {expired.delta}%
                                    </BadgeDelta>
                                </Flex>
                                <Text className='mt-2 text-xl font-semibold'>{expired.expiredPercentagePrevMonth}%</Text>
                                <ProgressBar value={expired.expiredPercentagePrevMonth} className='mt-2' color='red' />
                                <Text className='mt-2'>Total de medicinas: {expired.total}</Text>
                            </Card>

                            <Card className="max-w-sm">
                                <Flex justifyContent="between" alignItems="center">
                                    <Text>Ordenes a tiempo (% - último mes)</Text>
                                </Flex>
                                <Metric>{onTime.onTimePercentage}% </Metric>
                                <ProgressBar value={onTime.onTimePercentage} className='mt-2' />
                                <Flex justifyContent="between" alignItems="center" className="mt-2">
                                    <Text>Mes Anterior</Text>
                                    <BadgeDelta deltaType={deltaType(onTime.delta)} isIncreasePositive={isIncreasePositive(onTime.delta)} className='font-semibold'>
                                        {onTime.delta}%
                                    </BadgeDelta>
                                </Flex>
                                <Text className='mt-2 text-xl font-semibold'>{onTime.onTimePercentagePrevMonth}%</Text>
                                <ProgressBar value={onTime.onTimePercentagePrevMonth} className='mt-2' color='red' />
                                <Text className='mt-2'>Total de ordenes: {onTime.total}</Text>
                            </Card>

                            <Card className="max-w-sm">
                                <div className="flex flex-col items-left justify-left h-full py-6">
                                    <Flex justifyContent="between" alignItems="center">
                                        <Text>Tiempo de entrega (días - último mes)</Text>
                                    </Flex>
                                    <Metric>{leadTime.leadTime} días </Metric>
                                    <Flex justifyContent="between" alignItems="center" className="mt-2">
                                        <Text>Mes Anterior</Text>
                                        <BadgeDelta deltaType={deltaType(leadTime.delta)} isIncreasePositive={isIncreasePositive(leadTime.delta)} className='font-semibold'>
                                            {leadTime.delta} días
                                        </BadgeDelta>
                                    </Flex>
                                    <Text className='mt-2 text-xl font-semibold'>{leadTime.leadTimePrevMonth} días</Text>
                                </div>
                            </Card>
                        </Grid>
                    </div>

                    <div className="flex flex-col items-left justify-left py-2">
                        <div className="flex flex-col items-left justify-left py-2">
                            <h1 className="text-2xl font-bold inline-block">
                                Medicinas con mayor criticidad
                            </h1>
                        </div>
                        <div className="flex flex-col items-left justify-left py-2">
                            <ResponsiveContainer width="75%" height={300}>
                                <ComposedChart
                                    width={500}
                                    height={400}
                                    data={dataGraph}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 20,
                                    }}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis dataKey="ID" scale="band" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#413ea0" label={{ value: 'Cantidad Ordenada', angle: -90, position: 'insideLeft' }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#ff7300" label={{ value: 'Porcentaje Acumulado (%)', angle: -90, position: 'insideRight' }} />
                                    <Tooltip 
                                        formatter={(value, name, props) => {
                                            if (name === 'acum_percentage') {
                                                return `${value.toFixed(2)}%`;
                                            } else {
                                                return value;
                                            }
                                        }}

                                        // Add the ID identifier to the tooltip
                                        labelFormatter={(value) => {
                                            return `IDProducto: ${value}`;
                                        }}



                                    />

                                    <Legend />
                                    <Bar yAxisId="left" dataKey="CantidadOrdenada" barSize={20} fill="#413ea0" />
                                    <Line yAxisId="right" type="monotone" dataKey="acum_percentage" stroke="#ff7300" dot={{ strokeWidth: 2 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
