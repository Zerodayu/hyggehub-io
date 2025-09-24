import { ClerkProvider } from "@clerk/nextjs";

export default function MyClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "var(--color-primary)",
          colorPrimaryForeground: "var(--color-primary-foreground)",
          colorText: "var(--color-foreground)",
          colorBackground: "var(--color-background)",
          colorBorder: "var(--color-border)",
          colorInputBackground: "var(--color-input-background)",
          fontFamily: "var(--font-geist-sans)",
          colorDanger: "var(--color-danger)",
          colorTextSecondary: "var(--color-muted-foreground)",
          colorForeground: "var(--color-foreground)",
          colorInput: "var(--color-input)",
          colorInputForeground: "var(--color-input-foreground)",
          colorNeutral: "var(--color-neutral)",
          colorRing: "var(--color-ring)",
          colorShadow: "var(--color-shadow)",
          colorModalBackdrop: "var(--color-modal-backdrop)",
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}
