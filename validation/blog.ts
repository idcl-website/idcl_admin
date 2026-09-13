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

    // SEO fields (all optional)
    metaTitle: yup
        .string()
        .max(60, 'Keep the meta title at or under 60 characters'),
    metaDescription: yup
        .string()
        .max(160, 'Keep the meta description at or under 160 characters'),
    slug: yup
        .string()
        .matches(/^\/?[a-z0-9]+(-[a-z0-9]+)*\/?$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
    primaryKeywords: yup.string(),
    secondaryKeywords: yup.string(),
    publishedDate: yup.string().nullable(),
    isPublished: yup.boolean(),
    author: yup.string(),
    tags: yup.string(),
});