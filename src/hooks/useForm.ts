import { useState } from 'react';

interface Event {
    target: {
        name: string;
        value: string;
    }
}

export function useForm<T> ( initialState: T ) {

    const [ formState, setFormState ] = useState( initialState );

    const onInputChange = ({ target }: Event) => {
        const { name, value } = target;

        setFormState({
            ...formState,
            [ name ] : value,
        });
    }

    const onResetForm = () => {
        setFormState( initialState );
    }

    const onChange = (newState: Event['target']) => {
        const { name, value } = newState;

        setFormState({
            ...formState,
            [ name ]: value,
        })
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        onChange,
    }
}
