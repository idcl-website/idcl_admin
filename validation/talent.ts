import * as yup from 'yup';

export const talentSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format'
        ),
    track: yup
        .string()
        .required('Track is required')
        .min(2, 'Track must be at least 2 characters')
        .max(50, 'Track cannot exceed 50 characters'),
});