"use client"
import { TalentService } from "@/services/talent";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { TalentInterface } from "../page";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Mail, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TalentProfile() {
    const { id } = useParams();
    const router = useRouter();
    const [talent, setTalent] = useState<TalentInterface | null>(null)

    useEffect(() => {
        const getTalent = async () => {
            const data = await TalentService.getTalent(id as string);
            setTalent(data)
        }
        getTalent();
    }, [id])

    return (
        <>
            {talent && (
                <motion.div
                    className="w-full max-w-2xl mx-auto p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="gap-2 cursor-pointer text-blue-500"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Talents
                        </Button>
                        <Card className="shadow-lg rounded-2xl border border-gray-200">
                            <CardHeader className="flex flex-row items-center gap-6 pb-4 border-b border-gray-100">
                                <Avatar className="h-20 w-20 shadow-md">
                                    <AvatarImage src={talent.image} alt={talent.name} />
                                    <AvatarFallback className="text-lg font-medium">
                                        {talent.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900">{talent.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={talent.isApproved ? "default" : "secondary"}>
                                            {talent.isApproved ? "Approved" : "Pending"}
                                        </Badge>
                                        <Badge variant="outline">{talent.track}</Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 text-sm text-gray-700 pt-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{talent.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {format(new Date(talent.date), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Experience: {talent.fullYear} {talent.fullYear === 1 ? "year" : "years"}
                                    </span>
                                </div>
                            </CardContent>

                            {!talent.isApproved && (
                                <CardFooter className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 transition-colors"
                                    // onClick={() => onApprove(talent.id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                    // onClick={() => onReject(talent.id)}
                                    >
                                        Reject
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </div>

                </motion.div>
            )}
        </>
    );
}