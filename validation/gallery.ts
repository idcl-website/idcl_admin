import * as yup from 'yup';

export const gallerySchema = yup.object().shape({
    title: yup
        .string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters'),
    category: yup
        .string()
        .required('Category is required')
        .min(2, 'Category must be at least 2 characters'),
    description: yup
        .string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    slug: yup
        .string()
        .required('Slug is required')
        .min(3, 'Slug must be at least 3 characters'),
});
