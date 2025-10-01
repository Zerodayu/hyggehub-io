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
        style: {
            '--normal-bg': 'var(--background)',
            '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
            '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
        } as React.CSSProperties
    })
    if (onUpdated) onUpdated()
}

export function ToastErrorPopup({
    message = 'Oops, there was an error processing your request.',
}: {
    message?: string
}) {
    toast.error(message, {
        style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
        } as React.CSSProperties
    })
}