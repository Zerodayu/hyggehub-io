"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrg, addShopMessage, updateShopMessage, deleteShopMessage } from "@/api/api-org"
import { useOrganization, useUser } from "@clerk/nextjs"
import { ToastSuccessPopup, ToastErrorPopup,ToastLoadingPopup, dismissToast } from "@/components/sonnerShowHandler"
import { formatDateForDatabase, formatDateForDisplay } from "@/utils/save-as-date"
import { formatMessage } from "@/lib/twilio-sms" // Import the message template function
import CalendarPickerInput from "./calendarPicker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { sendSmsToShopSubscribers } from "@/api/api-sms";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Settings2,
    MailPlus,
    SquarePen,
    Send,
    MessageSquare,
    Plus,
    RefreshCw,
    Trash
} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ShopCardSection() {
    const { organization } = useOrganization()
    const { user } = useUser()
    const queryClient = useQueryClient()
    const [newMessage, setNewMessage] = useState("")
    const [newTitle, setNewTitle] = useState("")
    const [newExpiresAt, setNewExpiresAt] = useState("")
    const [editMessage, setEditMessage] = useState({ id: "", value: "", title: "", expiresAt: "" })
    // Track which message is currently being sent to prevent multiple submissions
    const [sendingMessageId, setSendingMessageId] = useState<string | null>(null)

    // Fetch shop data including messages
    const { data: orgData, isLoading } = useQuery({
        queryKey: ['org', organization?.id],
        queryFn: () => organization?.id ? getOrg(organization.id) : null,
        enabled: !!organization?.id
    })

    const sendSmsMutation = useMutation({
        mutationFn: ({ message, messageId, title, expiresAt }: { message: string, messageId: string, title: string, expiresAt: string | null }) => {
            if (!organization?.id) throw new Error("No organization selected");
            setSendingMessageId(messageId);

            // Using the new template system
            const templateData = {
                shopName: orgData?.shop?.name || "unknown",
                title: title || "",
                message: message,
                expiresAt: expiresAt ? formatDateForDisplay(expiresAt) : ""
            };

            // Use the formatMessage function with the "promotion" template
            const formattedMessage = formatMessage("promotion", templateData);

            return sendSmsToShopSubscribers({
                orgId: organization.id,
                message: formattedMessage,
                senderName: orgData?.shop?.shopCode // Add the shopCode as senderName
            });
        },
        onSuccess: (data) => {
            if (data.success) {
                ToastSuccessPopup({
                    queryClient,
                    orgId: organization?.id,
                    message: `Message sent to ${data.messages?.length || 0} subscribers`
                });
            } else {
                ToastErrorPopup({
                    message: data.message || "Failed to send message"
                });
            }
            setSendingMessageId(null);
        },
        onError: (error) => {
            ToastErrorPopup({
                message: `Failed to send message: ${(error as Error).message}`
            });
            setSendingMessageId(null);
        }
    });

    const addMessageMutation = useMutation({
        mutationFn: () => {
            if (!organization?.id) throw new Error("No organization selected")
            // Show a loading toast when adding a message and store the ID
            const loadingToastId = ToastLoadingPopup({
                message: "Adding message..."
            })
            return addShopMessage({
                orgId: organization.id,
                title: newTitle,
                message: newMessage,
                expiresAt: formatDateForDatabase(newExpiresAt)
            }).then(result => {
                // Dismiss the loading toast when the operation completes
                dismissToast(loadingToastId)
                return result
            }).catch(error => {
                // Also dismiss on error
                dismissToast(loadingToastId)
                throw error
            })
        },
        onSuccess: () => {
            ToastSuccessPopup({
                queryClient,
                orgId: organization?.id,
                message: "Message posted successfully"
            })
            setNewMessage("")
            setNewTitle("")
            setNewExpiresAt("")
            queryClient.invalidateQueries({ queryKey: ['org', organization?.id] })
        },
        onError: (error) => {
            ToastErrorPopup({
                message: `Failed to post message: ${error.message}`
            })
        }
    })

    const updateMessageMutation = useMutation({
        mutationFn: () => {
            if (!organization?.id || !user?.id) throw new Error("Missing user or organization")
            return updateShopMessage({
                orgId: organization.id,
                userId: user.id,
                messageId: editMessage.id,
                value: editMessage.value,
                title: editMessage.title,
                expiresAt: formatDateForDatabase(editMessage.expiresAt)
            })
        },
        onSuccess: () => {
            ToastSuccessPopup({
                queryClient,
                orgId: organization?.id,
                message: "Message updated successfully"
            })
            setEditMessage({ id: "", value: "", title: "", expiresAt: "" })
            queryClient.invalidateQueries({ queryKey: ['org', organization?.id] })
        },
        onError: (error) => {
            ToastErrorPopup({
                message: `Failed to update message: ${error.message}`
            })
        }
    })

    const deleteMessageMutation = useMutation({
        mutationFn: (messageId: string) => {
            if (!organization?.id) throw new Error("No organization selected")
            // Show a warning toast when deletion starts and store the ID
            const loadingToastId = ToastLoadingPopup({
                message: "Deleting message..."
            })
            return deleteShopMessage({
                orgId: organization.id,
                messageId: messageId
            }).then(result => {
                // Dismiss the loading toast when the operation completes
                dismissToast(loadingToastId)
                return result
            }).catch(error => {
                // Also dismiss on error
                dismissToast(loadingToastId)
                throw error
            })
        },
        onSuccess: () => {
            ToastSuccessPopup({
                queryClient,
                orgId: organization?.id,
                message: "Message deleted successfully"
            })
            queryClient.invalidateQueries({ queryKey: ['org', organization?.id] })
        },
        onError: (error) => {
            ToastErrorPopup({
                message: `Failed to delete message: ${(error as Error).message}`
            })
        }
    })

    // Define all handler functions at the top
    const handleSendMessageToSubscribers = (messageText: string, messageId: string, title: string, expiresAt: string | null) => {
        sendSmsMutation.mutate({
            message: messageText,
            messageId,
            title,
            expiresAt
        });
    };

    const handleAddMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newMessage.trim() && newTitle.trim()) {
            addMessageMutation.mutate()
        }
    }

    const handleUpdateMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (editMessage.value.trim() && editMessage.title.trim() && editMessage.id) {
            updateMessageMutation.mutate()
        }
    }

    const handleInitEditMessage = (message: { id: string; value: string; title: string; expiresAt: string | null }) => {
        setEditMessage({
            id: message.id,
            value: message.value,
            title: message.title || "",
            expiresAt: message.expiresAt || ""
        });
    };

    const handleEditTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditMessage({
            ...editMessage,
            title: e.target.value
        });
    };

    const handleEditMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditMessage({
            ...editMessage,
            value: e.target.value
        });
    };

    const handleEditExpiresAtChange = (date: string | ((prevDate: string) => string)) => {
        // Ensure we're using a string here, not a function
        if (typeof date === 'string') {
            setEditMessage({
                ...editMessage,
                expiresAt: date
            });
        }
    };

    const handleCancelEdit = () => {
        setEditMessage({ id: "", value: "", title: "", expiresAt: "" });
    };

    const messages = orgData?.shop?.messages || [];

    return (
        <section className="flex-1 py-6 px-8">
            <div className="grid w-full lg:min-w-xl py-4 gap-6">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button>
                            <MailPlus />
                            Add Message
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                                <form id="add-message-form" onSubmit={handleAddMessage} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-title">Title</Label>
                                        <Input
                                            id="new-title"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Message title"
                                            className="mb-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-message">Message</Label>
                                        <Textarea
                                            id="new-message"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message here..."
                                            className="mb-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-expires">Expiration Date (Optional)</Label>
                                        <CalendarPickerInput
                                            value={newExpiresAt}
                                            onChange={setNewExpiresAt}
                                        />
                                    </div>
                                </form>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    type="submit"
                                    form="add-message-form"
                                    className="font-mono"
                                    disabled={addMessageMutation.isPending || !newMessage.trim() || !newTitle.trim()}
                                >
                                    <Plus className="mr-1" size={16} />
                                    {addMessageMutation.isPending ? "Posting..." : "Add Message"}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* Shop Messages Section */}
                <div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center justify-between  pt-4 border-t">
                            <span className="flex items-center gap-2">
                                <Settings2 size={16} />
                                <h1 className="font-mono">Coupon Setups</h1>
                            </span>
                            <Button
                                variant="ghost"
                                onClick={() => queryClient.invalidateQueries({ queryKey: ['org', organization?.id] })}
                                aria-label="Refresh messages">
                                <RefreshCw />
                            </Button>
                        </div>
                        {/* Message Cards */}
                        {isLoading ? (
                            <Card>
                                <CardContent className="p-6">
                                    <p>Loading messages...</p>
                                </CardContent>
                            </Card>
                        ) : messages.length === 0 ? (
                            <Card>
                                <CardContent className="p-6">
                                    <p>No messages yet. Add your first shop message above!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            messages.map((message: { id: string; createdAt: string; title: string; value: string; expiresAt: string | null }) => (
                                <Card key={message.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold">{message.title || "Shop Message"}</CardTitle>
                                        <CardDescription>
                                            <div className="flex justify-between items-center">
                                                <span>
                                                    Posted: {new Date(message.createdAt).toLocaleDateString()}
                                                </span>
                                                {message.expiresAt && (
                                                    <span>
                                                        Expires: {formatDateForDisplay(message.expiresAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{message.value}</p>
                                    </CardContent>
                                    <CardFooter className="text-muted-foreground justify-between">
                                        <div>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive">
                                                        <Trash size={16} />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this message
                                                            and remove it from the system.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={deleteMessageMutation.isPending}>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deleteMessageMutation.mutate(message.id)}
                                                            disabled={deleteMessageMutation.isPending}
                                                        >
                                                            {deleteMessageMutation.isPending ? (
                                                                <>
                                                                    <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                                                                    Deleting...
                                                                </>
                                                            ) : (
                                                                "Delete"
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>

                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="secondary"
                                                        className="font-mono"
                                                        onClick={() => handleInitEditMessage(message)}
                                                    >
                                                        <SquarePen size={16} className="mr-1" />
                                                        Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <MessageSquare size={20} />
                                                            Edit Shop Message
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Update your shop message. Click save when you&apos;re done.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={handleUpdateMessage}>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="edit-title">Title</Label>
                                                                <Input
                                                                    id="edit-title"
                                                                    value={editMessage.title}
                                                                    onChange={handleEditTitleChange}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="edit-message">Message</Label>
                                                                <Textarea
                                                                    id="edit-message"
                                                                    value={editMessage.value}
                                                                    onChange={handleEditMessageChange}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="edit-expires">Expiration Date (Optional)</Label>
                                                                <CalendarPickerInput
                                                                    value={editMessage.expiresAt}
                                                                    onChange={handleEditExpiresAtChange}
                                                                    label="Expiration Date (Optional)"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={handleCancelEdit}
                                                                    disabled={updateMessageMutation.isPending}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </DialogClose>
                                                            <Button
                                                                type="submit"
                                                                disabled={updateMessageMutation.isPending || !editMessage.value.trim() || !editMessage.title.trim()}
                                                            >
                                                                {updateMessageMutation.isPending ? "Saving..." : "Save changes"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                className="font-mono"
                                                onClick={() => handleSendMessageToSubscribers(
                                                    message.value,
                                                    message.id,
                                                    message.title,
                                                    message.expiresAt
                                                )}
                                                disabled={sendingMessageId === message.id}
                                            >
                                                <Send className="mr-1" size={16} />
                                                {sendingMessageId === message.id ? "Sending..." : "Post"}
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
