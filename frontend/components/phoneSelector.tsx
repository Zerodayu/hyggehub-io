"use client"

import { Phone, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useId, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from "@/lib/utils"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

const countryCodes = [
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+91", label: "🇮🇳 +91" },
    { value: "+61", label: "🇦🇺 +61" },
    { value: "+81", label: "🇯🇵 +81" },
    { value: "+49", label: "🇩🇪 +49" },
]

const InputStartSelectDemo = () => {
    const id = useId()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(countryCodes[0].value)

    return (
        <div className='w-full space-y-2 py-2'>
            <Label htmlFor={id}>Input with country code select</Label>
            <div className='flex rounded-md shadow-xs'>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="rounded-r-none shadow-none focus-visible:z-1 w-[120px] justify-between"
                        >
                            {value
                                ? countryCodes.find((code) => code.value === value)?.label
                                : "Select country code..."}
                            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command>
                            <CommandInput placeholder="Search country..." className="h-9" />
                            <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                    {countryCodes.map((code) => (
                                        <CommandItem
                                            key={code.value}
                                            value={code.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            {code.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === code.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Input
                    id={id}
                    type='tel'
                    placeholder='Enter number'
                    className='-ms-px rounded-l-none shadow-none text-foreground font-mono'
                />
            </div>
        </div>
    )
}

export default function PhoneSelectorInput() {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="font-mono text-xs text-muted-foreground">
                        <Phone />
                        Set Phone Number
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-opacity-50 backdrop-blur">
                    <DialogHeader>
                        <DialogTitle>Shops Phone Number</DialogTitle>
                        <DialogDescription>
                            <span>
                                <InputStartSelectDemo />
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="font-mono">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="font-mono">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
