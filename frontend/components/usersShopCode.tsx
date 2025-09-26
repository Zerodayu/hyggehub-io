import React, { useState } from "react";
import { useUpdateUser } from "@/api/get-users";
import { useUser } from "@clerk/nextjs";
import { TicketSlash, Tickets, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function UsersShopCodeInput() {
    const { user } = useUser();
    const [shopCode, setShopCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // <-- Add success state
    const [open, setOpen] = useState(false);

    const userId = user?.id;
    const updateUserMutation = useUpdateUser();

    const handleSubmit = async () => {
        if (!shopCode || !userId) return;
        setError(null);
        setSuccess(null);

        updateUserMutation.mutate(
            { userId, userData: { shopCode } },
            {
                onSuccess: (data: any) => {
                    if (!data.success) {
                        setError(data.message || data.error || "Unknown error.");
                    } else {
                        setSuccess(data.message); // <-- Show API success message
                        setShopCode("");
                    }
                },
                onError: (err: any) => {
                    const apiError = err?.response?.data;
                    setError(
                        apiError?.message ||
                        apiError?.error ||
                        "Invalid shop code. Please try again."
                    );
                    setShopCode("");
                },
            }
        );
    };

    const handleCancel = () => {
        setOpen(false);
        setShopCode("");
        setError(null);
        setSuccess(null); // <-- Reset success on cancel
        updateUserMutation.reset();
    };

    return (
        <AlertDialog open={open}>
            <AlertDialogTrigger asChild>
                <Button className="font-mono" onClick={() => setOpen(true)}>
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
                        {error && (
                            <span className="text-destructive text-sm mt-2">{error}</span>
                        )}
                        {success && (
                            <span className="text-success text-sm mt-2">{success}</span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updateUserMutation.isPending}
                    >
                        Exit
                    </Button>
                    {updateUserMutation.isPending ? (
                        <Button size="sm" disabled>
                            <Loader2 className="animate-spin" size={16} />
                            Please wait
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={updateUserMutation.isPending}
                        >
                            Enter
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
