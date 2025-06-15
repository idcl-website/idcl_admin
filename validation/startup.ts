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
    reach: yup.string().required('Patients reached is required').min(2, 'patients reached must be at least 2 characters'),
    region: yup.string().required('Regions covered is required').min(2, 'Region reached must be more than 2 characters'),
    size: yup.string().required('Team size is required').min(1, 'Must be at least one team member'),
    funds: yup.string().required('Funding raised is required').min(2, 'Funds must be at least tw0 figures'),
    support: yup.string().required('Support received is required').min(5, 'Must be at least 5 characters'),
    story: yup.string().required('Founder story is required').min(5, 'Must be at least 5 characters'),
    description: yup.string().required('Description is required').min(10, 'Must be at least 10 characters'),
    industry: yup.string().required('Industry is required').min(3, 'Must be at least 3 characters'),
    type: yup.string()
        .required('Business type is required')
        .test(
            'not-empty',
            'Business type is required',
            (value) => value !== undefined && value !== null && value !== ''
        ),
    founders: yup.array().of(founderSchema).min(1, 'At least one founder is required'),
});