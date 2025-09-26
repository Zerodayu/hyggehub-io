import React, { useState } from "react";
import { useUpdateUser } from "@/api/get-users";
import { useUser } from "@clerk/nextjs";
import { TicketSlash, Tickets } from "lucide-react"
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function UsersShopCodeInput() {
    const {user} = useUser();
    const [shopCode, setShopCode] = useState("");
    const updateUserMutation = useUpdateUser();

    const userId = user?.id;

    const handleSubmit = () => {
        if (!shopCode || !userId) return;
        updateUserMutation.mutate({ userId, userData: { shopCode } });
        setShopCode("");
    };

    return (
        <AlertDialog >
            <AlertDialogTrigger asChild>
                <Button className="font-mono">
                    <TicketSlash />
                    Enter Shop Code
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <span className="flex items-center gap-2">
                            <Tickets size={20} />
                            Add Shop Code
                        </span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="py-2">
                        <Input
                            id="shopCode"
                            placeholder="Shop Codes"
                            type="text"
                            value={shopCode}
                            onChange={(e) => setShopCode(e.target.value)}
                        />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Enter</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
