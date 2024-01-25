import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
} from "@mui/material";

export const Imagen = () => {

    const [Imagen, setImagen] = useState(null);

    const [viewImagen, setViewImagen] = useState(null)

    const changeImagen = async (e) => {
        console.log('e', e)
        setImagen(e.target.files[0]);
        setViewImagen(URL.createObjectURL(e.target.files[0]));
        console.log('Imagen', Imagen);
    }

    return (
        <>
            <Box px={2}>
                <Card>
                    <CardContent>
                        <Box py={4}>
                            <Button
                                onChange={changeImagen}
                                variant="contained"
                                component="label"
                            >
                                AGREGAR IMAGEN
                                <input
                                    type="file"
                                    hidden
                                />
                            </Button>
                        </Box>

                        <Box pb={2}>
                            <img width={200} src={viewImagen} />
                        </Box>

                    </CardContent>
                </Card >
            </Box >
        </>
    );
};