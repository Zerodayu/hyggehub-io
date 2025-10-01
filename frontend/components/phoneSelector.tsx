"use client"

import { Phone, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useId, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, filterNumbers } from "@/lib/utils"
import { countryCodes } from "@/utils/country-code";
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
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrg, updateOrgPhoneNo } from '@/api/api-org';

const InputStartSelectDemo = ({ value, setValue, phoneNo, setPhoneNo }: {
    value: string,
    setValue: (v: string) => void,
    phoneNo: string,
    setPhoneNo: (v: string) => void
}) => {
    const id = useId()
    const [open, setOpen] = useState(false)

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
                    value={phoneNo}
                    onChange={e => setPhoneNo(filterNumbers(e.target.value))}
                />
            </div>
        </div>
    )
}

export default function PhoneSelectorInput() {
    const { organization } = useOrganization();
    const { user } = useUser();
    const orgId = organization?.id;
    const userId = user?.id;

    // Fetch shop data (including phone number) from backend
    const { data, isLoading } = useQuery({
        queryKey: ['shop', orgId],
        queryFn: () => orgId ? getOrg(orgId) : Promise.resolve(null),
        enabled: !!orgId,
    });

    // Get phoneNo from backend response
    const orgPhoneNo = data?.shop?.shopNum as string | undefined;

    const [countryCode, setCountryCode] = useState(() => {
        if (orgPhoneNo) {
            const code = countryCodes.find(c => orgPhoneNo.startsWith(c.value));
            return code ? code.value : countryCodes[0].value;
        }
        return countryCodes[0].value;
    });
    const [phoneNo, setPhoneNo] = useState(() => {
        if (orgPhoneNo) {
            const code = countryCodes.find(c => orgPhoneNo.startsWith(c.value));
            return code ? orgPhoneNo.slice(code.value.length) : orgPhoneNo;
        }
        return "";
    });

    // Sync input fields with backend value when orgPhoneNo changes
    useEffect(() => {
        if (orgPhoneNo) {
            const code = countryCodes.find(c => orgPhoneNo.startsWith(c.value));
            setCountryCode(code ? code.value : countryCodes[0].value);
            setPhoneNo(code ? orgPhoneNo.slice(code.value.length) : orgPhoneNo);
        }
    }, [orgPhoneNo]);

    // Track original values for change detection
    const originalFullPhoneNo = orgPhoneNo ?? "";

    const isChanged = `${countryCode}${phoneNo}` !== originalFullPhoneNo;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (fullPhoneNo: string) => {
            if (!orgId || !userId) throw new Error("Missing orgId or userId");
            return updateOrgPhoneNo({ orgId, userId, phoneNo: fullPhoneNo });
        },
        onSuccess: () => {
            // Refetch shop data after successful update
            queryClient.invalidateQueries({ queryKey: ['shop', orgId] });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orgId || !isChanged) return;
        mutation.mutate(`${countryCode}${phoneNo}`);
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="font-mono text-xs text-muted-foreground">
                        <Phone />
                        {isLoading
                            ? "Loading..."
                            : (orgPhoneNo ?? "Add phone number")}
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-opacity-50 backdrop-blur">
                    <DialogHeader>
                        <DialogTitle>Shops Phone Number</DialogTitle>
                        <DialogDescription>
                            <div>
                                <InputStartSelectDemo
                                    value={countryCode}
                                    setValue={setCountryCode}
                                    phoneNo={phoneNo}
                                    setPhoneNo={setPhoneNo}
                                />
                            </div>
                            {mutation.isSuccess && <span className="text-xs text-muted-foreground">Saved!</span>}
                            {mutation.isError && <span className="text-xs text-destructive">Error: {mutation.error?.message}</span>}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="font-mono"
                                disabled={mutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="font-mono"
                            onClick={handleSubmit}
                            disabled={mutation.isPending || !phoneNo || !orgId || !isChanged}
                        >
                            {mutation.isPending ? "Updating..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
