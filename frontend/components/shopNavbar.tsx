import { Button } from "./ui/button"
import Dropdown from "./comp-368"

export default function ShopSidebar() {
    return (
        <section className="fixed py-6 px-8">
            <div className="flex bg-muted/20 backdrop-blur-xs items-start justify-start w-content outline outline-muted rounded-full px-4 py-2 gap-4">
                <Dropdown />
                <Button
                    variant="link"
                    className="font-mono font-bold"
                >Settings</Button>
            </div>
        </section>
    )
}
