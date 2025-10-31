"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getOrg, updateOrgPhoneNo } from '@/api/api-org'
import { countryCodes } from "@/utils/country-code"
import { Key, Settings2 } from "lucide-react"
import { validateSenderName } from "@/lib/senderNameValidator"
import { ToastSuccessPopup, ToastErrorPopup } from "./sonnerShowHandler"

export default function ShopEditSheet({ onUpdated }: { onUpdated?: () => void }) {
    const { organization } = useOrganization()
    const { user } = useUser()
    const orgId = organization?.id
    const userId = user?.id

    // Fetch shop data (including phone number) from backend
    const { data } = useQuery({
        queryKey: ['shop', orgId],
        queryFn: () => orgId ? getOrg(orgId) : Promise.resolve(null),
        enabled: !!orgId,
    })

    // Get phoneNo from backend response
    const orgPhoneNo = data?.shop?.shopNum as string | undefined
    const orgCode = data?.shop?.code as string | undefined

    const originalShopCode = orgCode ?? ""
    const [shopCode, setShopCode] = useState(originalShopCode)
    const [shopCodeError, setShopCodeError] = useState<string>("")

    const [countryCode, setCountryCode] = useState(() => {
        if (orgPhoneNo) {
            const code = countryCodes.find(c => orgPhoneNo.startsWith(c.value))
            return code ? code.value : countryCodes[0].value
        }
        return countryCodes[0].value
    })

    const [phoneNo, setPhoneNo] = useState(() => {
        if (orgPhoneNo) {
            const code = countryCodes.find(c => orgPhoneNo.startsWith(c.value))
            return code ? orgPhoneNo.slice(code.value.length) : orgPhoneNo
        }
        return ""
    })

    useEffect(() => {
        if (orgPhoneNo) {
            const code = countryCodes.find(c => orgPhoneNo.startsWith(c.value))
            setCountryCode(code ? code.value : countryCodes[0].value)
            setPhoneNo(code ? orgPhoneNo.slice(code.value.length) : orgPhoneNo)
        }
    }, [orgPhoneNo])

    useEffect(() => {
        setShopCode(originalShopCode)
    }, [originalShopCode])

    const originalFullPhoneNo = orgPhoneNo ?? ""
    const isPhoneChanged = `${countryCode}${phoneNo}` !== originalFullPhoneNo
    const isShopCodeChanged = shopCode !== originalShopCode
    const isChanged = isPhoneChanged || isShopCodeChanged

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({ fullPhoneNo, shopCode }: { fullPhoneNo: string, shopCode: string }) => {
            if (!orgId || !userId) throw new Error("Missing orgId or userId")
            return updateOrgPhoneNo({ orgId, userId, phoneNo: fullPhoneNo, shopCode })
        },
        onSuccess: () => {
            ToastSuccessPopup({
                queryClient,
                orgId,
                onUpdated,
                message: "Shop details updated successfully!"
            })
        },
        onError: (error: Error | unknown) => {
            ToastErrorPopup({
                message: error instanceof Error ? error.message : "Failed to update shop details."
            })
        }
    })

    const handleShopCodeChange = (value: string) => {
        const validation = validateSenderName(value)
        const formattedValue = validation.formattedName || value
        setShopCode(formattedValue)
        setShopCodeError(validation.error || "")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orgId || !isChanged) return

        // Clear any previous errors
        setShopCodeError("")

        const validation = validateSenderName(shopCode)
        if (!validation.isValid) {
            setShopCodeError(validation.error || "Invalid shop code")
            return
        }

        // Use the current shopCode value directly since it's already formatted
        mutation.mutate({ 
            fullPhoneNo: `${countryCode}${phoneNo}`,
            shopCode: shopCode.trim() // Ensure no whitespace
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <Settings2 />
                    Setup
                </Button>
            </SheetTrigger>
            <SheetContent className="h-screen">
                <SheetHeader>
                    <SheetTitle>Edit Shop Details</SheetTitle>
                    <SheetDescription>
                        Make changes to your shop here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid flex-1 auto-rows-min gap-4 px-4">
                        {/* Phone input replaces name input */}
                        {/* <PhoneNumInput
                            value={countryCode}
                            setValue={setCountryCode}
                            phoneNo={phoneNo}
                            setPhoneNo={setPhoneNo}
                        /> */}
                        {mutation.isError && <span className="text-xs text-destructive">Error: {mutation.error instanceof Error ? mutation.error.message : "Unknown error"}</span>}
                        <div className="grid gap-3">
                            <Label htmlFor="shop-code-input">
                                Shop code & Sender Name
                                {originalShopCode && (
                                    <span className="ml-2 text-xs text-muted-foreground">(Current: {originalShopCode})</span>
                                )}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="shop-code-input"
                                    placeholder="SAMPLEshop"
                                    type="text"
                                    className={`text-foreground font-mono ${shopCodeError ? 'border-destructive' : ''}`}
                                    value={shopCode}
                                    onChange={e => handleShopCodeChange(e.target.value)}
                                />
                                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                                    <Key size={16} aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="py-20">
                        <Button
                            type="submit"
                            disabled={mutation.isPending || !orgId || (!isPhoneChanged && !isShopCodeChanged)}
                        >
                            {mutation.isPending ? "Updating..." : "Save changes"}
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
