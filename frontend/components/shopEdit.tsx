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
import { InputStartSelectDemo } from "./phoneSelector" // Make sure to export this from phoneSelector.tsx

export default function ShopEditSheet() {
  const { organization } = useOrganization()
  const { user } = useUser()
  const orgId = organization?.id
  const userId = user?.id

  // Fetch shop data (including phone number) from backend
  const { data, isLoading } = useQuery({
    queryKey: ['shop', orgId],
    queryFn: () => orgId ? getOrg(orgId) : Promise.resolve(null),
    enabled: !!orgId,
  })

  // Get phoneNo from backend response
  const orgPhoneNo = data?.shop?.shopNum as string | undefined

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

  const originalFullPhoneNo = orgPhoneNo ?? ""
  const isChanged = `${countryCode}${phoneNo}` !== originalFullPhoneNo

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (fullPhoneNo: string) => {
      if (!orgId || !userId) throw new Error("Missing orgId or userId")
      return updateOrgPhoneNo({ orgId, userId, phoneNo: fullPhoneNo })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop', orgId] })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgId || !isChanged) return
    mutation.mutate(`${countryCode}${phoneNo}`)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            {/* Phone input replaces name input */}
            <InputStartSelectDemo
              value={countryCode}
              setValue={setCountryCode}
              phoneNo={phoneNo}
              setPhoneNo={setPhoneNo}
            />
            {mutation.isSuccess && <span className="text-xs text-muted-foreground">Saved!</span>}
            {mutation.isError && <span className="text-xs text-destructive">Error: {mutation.error?.message}</span>}
            <div className="grid gap-3">
              <Label htmlFor="sheet-demo-username">Username</Label>
              <Input id="sheet-demo-username" defaultValue="@peduarte" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={mutation.isPending || !phoneNo || !orgId || !isChanged}>
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
