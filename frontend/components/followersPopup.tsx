"use client"

import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrgCustomers, delCustomer as deleteCustomerApi } from "@/api/api-org"
import { useOrganization } from "@clerk/nextjs"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, CircleUser } from "lucide-react"
import { ToastSuccessPopup, ToastErrorPopup } from "./sonnerShowHandler"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Update type to match actual API response
type Customer = {
  customerId: string
  name: string
  phone: string
  birthday?: string
  createdAt?: string
}

export default function FollowersList() {
  const { organization } = useOrganization()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ["customers", organization?.id],
    queryFn: () => organization?.id ? getOrgCustomers(organization.id) : Promise.resolve([]),
    enabled: !!organization?.id,
  })

  const deleteMutation = useMutation({
    mutationFn: ({ orgId, customerId }: { orgId: string, customerId: string }) =>
      deleteCustomerApi({ orgId, customerId }),
    onSuccess: (variables) => {
      // Invalidate and refetch customers after deletion
      queryClient.invalidateQueries({ queryKey: ["customers", organization?.id] })

      // Show success toast
      ToastSuccessPopup({
        queryClient,
        orgId: variables.orgId,
        message: "Customer deleted successfully!"
      })
    },
    onError: (error: Error | unknown) => {
      // Show error toast
      ToastErrorPopup({
        message: error instanceof Error ? error.message : "Failed to delete customer."
      })
    }
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const delCustomer = (customer: Customer) => {
    if (organization?.id) {
      deleteMutation.mutate({
        orgId: organization.id,
        customerId: customer.customerId
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" className="font-mono">
          {customers?.length ? `${customers.length}` : '0'} Followers
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex gap-2 border-b px-6 py-4 text-base font-mono">
            <Users />
            Customers / Followers
          </DialogTitle>
          <div className="overflow-y-auto">
            <div className="px-6 py-4">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={`skeleton-${index}`} className="flex items-center justify-between my-2 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[120px]" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-[80px]" />
                  </div>
                ))
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Failed to load customers
                </div>
              ) : !customers || customers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No followers yet
                </div>
              ) : (
                customers.map((customer: Customer) => (
                  <div key={customer.customerId} className="flex items-center justify-between my-2 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <CircleUser size={32} />
                      <span>
                        <div className="text-foreground">{customer.name}</div>
                        <div className="text-muted-foreground">{customer.phone}</div>
                      </span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="font-mono text-xs font-bold"
                        >Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            account and remove the data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => delCustomer(customer)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="px-4 py-4 border-t sm:justify-start">
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Close"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
