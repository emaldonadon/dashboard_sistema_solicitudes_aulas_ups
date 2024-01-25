import React from 'react'
import { TextField, Box } from '@mui/material';
function InputValidation({ estado, cambiarEstado, disabled, type, label, name, helperText, patterns, funcion, multiline }) {
    const onChange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value });
    }
    const validacion = () => {
        if (patterns) {
            if (patterns.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: true });
            } else {
                cambiarEstado({ ...estado, valido: false });
            }
        }
        if (funcion) {
            funcion();
        }
    }
    return (
            <TextField
                fullWidth
                label={label}
                size='small'
                type={type}
                autoComplete="off"
                id={name}
                value={estado.campo}
                onChange={onChange}
                onKeyUp={validacion}
                onBlur={validacion}
                error={estado.valido === false}
                helperText={estado.valido === false ? helperText : ' '}
            />
    );
}
export default InputValidation
