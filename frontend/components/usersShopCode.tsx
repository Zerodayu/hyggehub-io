import React, { useState } from "react";
import { useUpdateUser } from "@/api/get-users";
import { useUser } from "@clerk/nextjs";
import { TicketSlash, Tickets, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function UsersShopCodeInput() {
    const { user } = useUser();
    const [shopCode, setShopCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const updateUserMutation = useUpdateUser();

    const userId = user?.id;

    const handleSubmit = async () => {
        if (!shopCode || !userId) return;
        setError(null);

        updateUserMutation.mutate(
            { userId, userData: { shopCode } },
            {
                onSuccess: () => {
                    setShopCode("");
                    setOpen(false);
                },
                onError: (err: any) => {
                    setError(
                        err?.response?.data?.message ||
                        "Invalid shop code. Please try again."
                    );
                },
            }
        );
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
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
                            disabled={updateUserMutation.isPending}
                        />
                        {updateUserMutation.isPending && (
                            <span className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Loader2 className="animate-spin" size={16} />
                                Validating code...
                            </span>
                        )}
                        {error && (
                            <span className="text-red-500 text-sm mt-2">{error}</span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={updateUserMutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSubmit}
                        disabled={updateUserMutation.isPending}
                    >
                        Enter
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
