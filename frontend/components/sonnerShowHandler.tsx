import { toast } from 'sonner'
import { QueryClient } from '@tanstack/react-query'

export function ToastSuccessPopup({
    queryClient,
    orgId,
    onUpdated,
    message = 'Default message',
}: {
    queryClient: QueryClient,
    orgId: string | undefined,
    onUpdated?: () => void,
    message?: string
}) {
    queryClient.invalidateQueries({ queryKey: ['shop', orgId] })
    toast.success(message, {
        className: 'bg-background/50 backdrop-blur border border-green-500 text-green-500 dark:text-green-400 dark:border-green-400'
    })
    if (onUpdated) onUpdated()
}

export function ToastWarningPopup({
    message = 'Warning: Please check your input.',
}: {
    message?: string
}) {
    toast.warning(message, {
        className: 'bg-warning/10 backdrop-blur border border-warning text-warning'
    })
}

export function ToastErrorPopup({
    message = 'Oops, there was an error processing your request.',
}: {
    message?: string
}) {
    toast.error(message, {
        className: 'bg-destructive/10 backdrop-blur border border-destructive text-destructive'
    })
}

export function ToastLoadingPopup({
    message = 'Loading, please wait...',
    duration = 60000,  // Default 1 minute timeout for loading toasts
}: {
    message?: string,
    duration?: number
}) {
    return toast.loading(message, {
        className: 'bg-secondary/50 backdrop-blur border border-primary text-foreground',
        duration: duration
    })
}

// New function to dismiss a toast by its ID
export function dismissToast(toastId: string | number) {
    toast.dismiss(toastId)
}