"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Settings2,
    Cake,
    ClockArrowDown,
    CalendarCheck,
    Ticket,
    SquarePen,
    Send,
    MessageSquare,
    Plus
} from "lucide-react"
import { Textarea } from "./ui/textarea"
import DatetimeInput from "./dateTimeInput"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrg, addShopMessage, updateShopMessage } from "@/api/api-org"
import { useOrganization, useUser } from "@clerk/nextjs"
import { ToastSuccessPopup, ToastErrorPopup } from "@/components/sonnerShowHandler"

export default function ShopCardSection() {
    const { organization } = useOrganization()
    const { user } = useUser()
    const queryClient = useQueryClient()
    const [newMessage, setNewMessage] = useState("")
    const [editMessage, setEditMessage] = useState({ id: "", value: "" })
    
    // Fetch shop data including messages
    const { data: orgData, isLoading } = useQuery({
        queryKey: ['org', organization?.id],
        queryFn: () => organization?.id ? getOrg(organization.id) : null,
        enabled: !!organization?.id
    })
    
    // Message mutations
    const addMessageMutation = useMutation({
        mutationFn: () => {
            if (!organization?.id) throw new Error("No organization selected")
            return addShopMessage({ 
                orgId: organization.id, 
                message: newMessage 
            })
        },
        onSuccess: () => {
            ToastSuccessPopup({
                queryClient,
                orgId: organization?.id,
                message: "Message posted successfully"
            })
            setNewMessage("")
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
                value: editMessage.value
            })
        },
        onSuccess: () => {
            ToastSuccessPopup({
                queryClient,
                orgId: organization?.id,
                message: "Message updated successfully"
            })
            setEditMessage({ id: "", value: "" })
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
        if (newMessage.trim()) {
            addMessageMutation.mutate()
        }
    }
    
    const handleUpdateMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (editMessage.value.trim() && editMessage.id) {
            updateMessageMutation.mutate()
        }
    }
    
    const messages = orgData?.shop?.messages || []

    return (
        <section className="flex-1 py-6 px-8">
            <div className="grid w-full py-4 gap-12">
                {/* Shop Messages Section */}
                <div>
                    <span className="flex items-center gap-2 pb-4">
                        <MessageSquare size={16} />
                        <h1 className="font-mono">Shop Messages</h1>
                    </span>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Add New Message Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">New Message</CardTitle>
                                <CardDescription>Add a message for your customers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddMessage}>
                                    <Textarea 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="mb-2"
                                    />
                                    <Button 
                                        type="submit" 
                                        className="font-mono mt-2"
                                        disabled={addMessageMutation.isPending || !newMessage.trim()}
                                    >
                                        <Plus className="mr-1" size={16} />
                                        {addMessageMutation.isPending ? "Posting..." : "Add Message"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

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
                            messages.map((message: { id: string; createdAt: string; value: string }) => (
                                <Card key={message.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold">Shop Message</CardTitle>
                                        <CardDescription>
                                            Posted: {new Date(message.createdAt).toLocaleDateString()}
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
                                                        Update your shop message. Click save when you're done.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleUpdateMessage}>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="message">Message</Label>
                                                            <Textarea
                                                                id="message"
                                                                value={editMessage.id === message.id ? editMessage.value : message.value}
                                                                onClick={() => setEditMessage({ id: message.id, value: message.value })}
                                                                onChange={(e) => setEditMessage({ id: message.id, value: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline" onClick={() => setEditMessage({ id: "", value: "" })}>
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>
                                                        <Button 
                                                            type="submit"
                                                            disabled={updateMessageMutation.isPending || !editMessage.value.trim()}
                                                        >
                                                            {updateMessageMutation.isPending ? "Saving..." : "Save changes"}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
                
                {/* Original Coupon Setups Section */}
                <div>
                    <span className="flex items-center gap-2 pb-4">
                        <Settings2 size={16} />
                        <h1 className="font-mono">Coupon Setups</h1>
                    </span>
                    <div className="grid grid-cols-1 gap-6">
                        {/* ... existing coupon cards ... */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <ClockArrowDown size={20} />
                                    <p>Slow hours boost</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Button variant="secondary" className="font-mono">
                                    <SquarePen />
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <Cake size={20} />
                                    <p>Birthday Special</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Button variant="secondary" className="font-mono">
                                    <SquarePen />
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <Ticket size={20} />
                                    <p>Holiday Promos</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Button variant="secondary" className="font-mono">
                                    <SquarePen />
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <CalendarCheck size={20} />
                                    <p>Weekend Specials</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Dialog>
                                    <form>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="font-mono">
                                                <SquarePen />
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <CalendarCheck size={20} />
                                                    Free Coffee Coupon
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Update your coupon details here. Click save when you&apos;re done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="name-1">Title</Label>
                                                    <Input id="title-1" defaultValue="Default title" />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="desc-1">Description</Label>
                                                    <Textarea id="desc-1" placeholder="Type your message here." defaultValue="Default description" />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="desc-1">Expiration Date</Label>
                                                    <DatetimeInput />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </form>
                                </Dialog>

                                <Button className="font-mono">
                                    <Send />
                                    Post
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
