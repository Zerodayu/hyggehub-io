"use client"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useId, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn, filterNumbers } from "@/lib/utils";
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


const countryCodes = [
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+91", label: "🇮🇳 +91" },
    { value: "+61", label: "🇦🇺 +61" },
    { value: "+81", label: "🇯🇵 +81" },
    { value: "+49", label: "🇩🇪 +49" },
];

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
        <section className="flex min-h-screen flex-col items-center justify-center">

            <Card className="w-[60vw]">
                <CardHeader>
                    <CardTitle className='font-mono text-lg'>Claim Shop Codes</CardTitle>
                    <CardDescription>Register your phone number to claim codes and receive exclusive offers.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className="w-full space-y-2 py-2">
                        <Label>Your Username/Name</Label>
                        <Input placeholder="Enter username or name" type="text" className='text-foreground font-mono'/>
                    </div>
                    <InputStartSelectDemo
                        value={countryCode}
                        setValue={setCountryCode}
                        phoneNo={phoneNo}
                        setPhoneNo={setPhoneNo}
                    />
                </CardContent>
                <CardFooter className='flex flex-col items-start'>
                    <Label className="text-sm text-muted-foreground mb-2">
                        The phone number you provide will be used for verification and to send you exclusive offers. We respect your privacy and will not share your information with third parties.
                    </Label>
                    <Button type="submit" className="w-full font-mono">
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}
