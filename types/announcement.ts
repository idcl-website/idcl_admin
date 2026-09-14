export type Announcement = {
    _id: string;
    message: string;
    isActive: boolean;
    order: number;
    link?: string;
    createdAt: string;
    updatedAt: string;
};
