import * as yup from 'yup';

// Founder validation schema
export const founderSchema = yup.object().shape({
    name: yup.string().required('Founder name is required').min(2, 'Name must be at least 2 characters'),
    position: yup.string().required('Position is required').min(2, 'Position must be at least 2 characters'),
    photo: yup.mixed().required('Photo is required'),
    facebook: yup.string().url('Must be a valid URL').nullable(),
    twitter: yup.string().url('Must be a valid URL').nullable(),
    linkedin: yup.string().url('Must be a valid URL').nullable(),
});

// Startup validation schema
export const startupSchema = yup.object().shape({
    logo: yup.mixed().required('Logo is required'),
    name: yup.string().required('Startup name is required').min(2, 'Name must be at least 2 characters'),
    location: yup.string().required('Location is required').min(2, 'Location must be at least 2 characters'),
    date: yup.date().required('Date founded is required').max(new Date(), 'Date cannot be in the future'),
    track: yup.string().required('Program track is required'),
    reach: yup.number().required('Patients reached is required').integer('Must be positive'),
    region: yup.number().required('Regions covered is required').integer('Must be positive'),
    size: yup.number().required('Team size is required').positive('Must be positive').integer('Must be a whole number'),
    funds: yup.number().required('Funding raised is required').positive('Must be positive'),
    support: yup.string().required('Support received is required').min(10, 'Must be at least 10 characters'),
    story: yup.string().required('Founder story is required').min(10, 'Must be at least 10 characters'),
    description: yup.string().required('Description is required').min(20, 'Must be at least 20 characters'),
    founders: yup.array().of(founderSchema).min(1, 'At least one founder is required'),
});