import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader, 
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { PricingTable } from "@clerk/nextjs"
import { PanelTopClose } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function PricingButton() {
    return (
        <div>
            <Drawer>
                <DrawerTrigger>Open</DrawerTrigger>
                <DrawerContent>
                    <DrawerClose asChild>
                        <DrawerHeader>
                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                            <DrawerDescription>
                                {/* You can add more content here if needed */}
                            </DrawerDescription>
                        </DrawerHeader>
                    </DrawerClose>
                    <PricingTable forOrganizations ctaPosition="bottom" newSubscriptionRedirectUrl="#" />
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button size="lg" variant="outline" className="flex w-full items-center justify-center">
                                Close
                                <PanelTopClose />
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
