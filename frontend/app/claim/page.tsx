"use client"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useId, useState } from "react";
import { ChevronsUpDown, Check, Key, Ticket, Send } from "lucide-react";
import { cn, filterNumbers } from "@/lib/utils";
import { countryCodes } from "@/utils/country-code";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


const InputStartSelectDemo = ({
    value,
    setValue,
    phoneNo,
    setPhoneNo,
}: {
    value: string;
    setValue: (v: string) => void;
    phoneNo: string;
    setPhoneNo: (v: string) => void;
}) => {
    const id = useId();
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full space-y-2 py-2">
            <Label htmlFor={id}>Input with country code select</Label>
            <div className="flex rounded-md shadow-xs">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="rounded-r-none shadow-none focus-visible:z-1 w-[100px] justify-between"
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
                                                setValue(currentValue);
                                                setOpen(false);
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
                    type="tel"
                    placeholder="Enter number"
                    className="-ms-px rounded-l-none text-foreground font-mono"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(filterNumbers(e.target.value))}
                />
            </div>
        </div>
    );
};

export default function Page() {
    const [countryCode, setCountryCode] = useState(countryCodes[0].value);
    const [phoneNo, setPhoneNo] = useState("");

    return (
        <section className="flex w-full min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-auto">
                <CardHeader>
                    <CardTitle className='flex gap-2 font-mono text-lg'>
                        Claim Shop Codes
                    </CardTitle>
                    <CardDescription>Register your phone number to claim codes and receive exclusive offers.</CardDescription>
                    <CardAction>
                        <Ticket size={40} />
                    </CardAction>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className="w-full space-y-2 py-2">
                        <Label>Your username/name</Label>
                        <Input placeholder="Enter username or name" type="text" className='text-foreground font-mono' />
                    </div>
                    <InputStartSelectDemo
                        value={countryCode}
                        setValue={setCountryCode}
                        phoneNo={phoneNo}
                        setPhoneNo={setPhoneNo}
                    />
                    <div className="flex-1 w-auto h-0.5 rounded bg-border shadow-sm" />
                    <div className="w-full space-y-2 py-2">
                        <Label>Shop code</Label>
                        <div className="relative">
                            <Input placeholder="Enter shop code" type="text" className='text-foreground font-mono' />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                                <Key size={16} aria-hidden="true" />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col items-start'>
                    <Label className="text-sm text-muted-foreground mb-2">
                        The phone number you provide will be used for verification and to send you exclusive offers. We respect your privacy and will not share your information with third parties.
                    </Label>
                    <Button type="submit" className="w-full font-mono">
                        Submit
                        <Send />
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}
