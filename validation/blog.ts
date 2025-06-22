import * as yup from 'yup';

export const blogSchema = yup.object().shape({
    title: yup
        .string()
        .required('title is required')
        .min(10, 'Name must be at least 10 characters'),
    snippet: yup
        .string()
        .required('snippet is required')
        .min(20, 'Name must be at least 10 characters'),
    body: yup
        .string()
        .required('body is required')
        .min(20, 'Track must be at least 2 characters'),
    location: yup
        .string()
        .required('location is required')
        .min(2, 'Track must be at least 2 characters'),
});