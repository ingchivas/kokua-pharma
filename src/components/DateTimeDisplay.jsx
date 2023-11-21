import React, { useState, useEffect } from "react";

const DateTimeDisplay = () => {
    const [currentDateTime, setCurrentDateTime] = useState(null);

    useEffect(() => {
        setCurrentDateTime(new Date());

        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!currentDateTime) {
        return <div className="font-semibold text-xl">Cargando fecha y hora...</div>;
    }

    return (
        <div className="font-semibold text-xl">
            <p>{currentDateTime.toLocaleDateString() + " " + currentDateTime.toLocaleTimeString()}</p>
        </div>
    );
};

export default DateTimeDisplay;
