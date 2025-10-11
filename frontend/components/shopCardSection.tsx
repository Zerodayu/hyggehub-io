"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrg, addShopMessage, updateShopMessage } from "@/api/api-org"
import { useOrganization, useUser } from "@clerk/nextjs"
import { ToastSuccessPopup, ToastErrorPopup } from "@/components/sonnerShowHandler"
import { formatDateForDatabase, formatDateForDisplay } from "@/utils/save-as-date"
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
    Plus
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
        mutationFn: ({ message, messageId }: { message: string, messageId: string }) => {
            if (!organization?.id) throw new Error("No organization selected");
            setSendingMessageId(messageId);
            return sendSmsToShopSubscribers({
                orgId: organization.id,
                message: message
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

    const handleSendMessageToSubscribers = (messageText: string, messageId: string) => {
        sendSmsMutation.mutate({ message: messageText, messageId });
    };

    // Message mutations
    const addMessageMutation = useMutation({
        mutationFn: () => {
            if (!organization?.id) throw new Error("No organization selected")
            return addShopMessage({
                orgId: organization.id,
                title: newTitle,
                message: newMessage,
                expiresAt: formatDateForDatabase(newExpiresAt)
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

    const messages = orgData?.shop?.messages || []

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
                                    {/* Removed the button from here */}
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
                        <span className="flex items-center gap-2 pt-4 border-t">
                            <Settings2 size={16} />
                            <h1 className="font-mono">Coupon Setups</h1>
                        </span>
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
                                    <CardFooter className="text-muted-foreground gap-2 justify-end">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="secondary" className="font-mono">
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
                                                                value={editMessage.id === message.id ? editMessage.title : message.title || ""}
                                                                onClick={() => setEditMessage({
                                                                    id: message.id,
                                                                    value: message.value,
                                                                    title: message.title || "",
                                                                    expiresAt: message.expiresAt || ""
                                                                })}
                                                                onChange={(e) => setEditMessage({
                                                                    ...editMessage,
                                                                    title: e.target.value
                                                                })}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="edit-message">Message</Label>
                                                            <Textarea
                                                                id="edit-message"
                                                                value={editMessage.id === message.id ? editMessage.value : message.value}
                                                                onClick={() => setEditMessage({
                                                                    id: message.id,
                                                                    value: message.value,
                                                                    title: message.title || "",
                                                                    expiresAt: message.expiresAt || ""
                                                                })}
                                                                onChange={(e) => setEditMessage({
                                                                    ...editMessage,
                                                                    value: e.target.value
                                                                })}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="edit-expires">Expiration Date (Optional)</Label>
                                                            <div onClick={() => setEditMessage({
                                                                id: message.id,
                                                                value: message.value,
                                                                title: message.title || "",
                                                                expiresAt: message.expiresAt || ""
                                                            })}>
                                                                <CalendarPickerInput
                                                                    value={editMessage.id === message.id ? editMessage.expiresAt : message.expiresAt || ""}
                                                                    onChange={(date: string | ((prevDate: string) => string)) => {
                                                                        // Ensure we're using a string here, not a function
                                                                        if (typeof date === 'string') {
                                                                            setEditMessage({
                                                                                ...editMessage,
                                                                                expiresAt: date
                                                                            });
                                                                        }
                                                                    }}
                                                                    label="Expiration Date (Optional)"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline" onClick={() => setEditMessage({ id: "", value: "", title: "", expiresAt: "" })}>
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
                                            onClick={() => handleSendMessageToSubscribers(message.value, message.id)}
                                            disabled={sendingMessageId === message.id}
                                        >
                                            <Send className="mr-1" size={16} />
                                            {sendingMessageId === message.id ? "Sending..." : "Post"}
                                        </Button>
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
