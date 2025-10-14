import { Button } from "./ui/button"
import Link from "next/link"

interface ShopNavbarProps {
    slug: string
}

export default function ShopNavbar({ slug }: ShopNavbarProps) {

    const navigations = [
        {
            title: "Settings",
            href: `/shops/${slug}/org-profile`
        },
        {
            title: "Pricing",
            href: `/shops/${slug}/plans`
        },
    ]
    return (
        <section className="fixed py-6 px-8 z-10">
            <div className="flex bg-muted/20 backdrop-blur-xs items-start justify-start w-content outline outline-muted rounded-full px-4 py-2 gap-4">
                {navigations.map((nav) => (
                    <Link href={nav.href} key={nav.title}>
                        <Button
                            key={nav.title}
                            variant="link"
                            className="font-mono font-bold"
                        >
                            {nav.title}
                        </Button>
                    </Link>
                ))}
            </div>
        </section>
    )
}
