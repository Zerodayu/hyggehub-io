"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useId, useState } from "react";
import {
  ChevronsUpDown,
  Check,
  Key,
  Ticket,
  Send,
  CircleCheck,
} from "lucide-react";
import { cn, removeSpaces } from "@/lib/utils";
import {
  countryCodes,
  formatForDisplay,
  formatToInternational,
  validatePhoneNumber,
} from "@/utils/country-code";
import CalendarPickerInput from "@/components/calendarPicker";
import { formatDateForDatabase } from "@/utils/save-as-date";
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
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { claimShopCode } from "@/api/api-customer";
import {
  ToastSuccessPopup,
  ToastErrorPopup,
} from "@/components/sonnerShowHandler";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("claim");
  const [countryCode, setCountryCode] = useState(countryCodes[0].value);
  const [phoneNo, setPhoneNo] = useState("");
  const [shopCode, setShopCode] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: claimShopCode,
    onSuccess: (data) => {
      ToastSuccessPopup({
        queryClient,
        orgId: undefined,
        message: data?.message,
      });

      setName("");
      setPhoneNo("");
      setShopCode("");
      setBirthday("");
      setCountryCode(countryCodes[0].value);
      setIsSuccess(true);
    },
    onError: (error: Error | { response?: { data?: { error?: string } } }) => {
      ToastErrorPopup({
        message:
          ("response" in error && error.response?.data?.error) || t("failed"),
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number before submitting
    if (!validatePhoneNumber(phoneNo, countryCode)) {
      ToastErrorPopup({
        message: t("invalidPhone"),
      });
      return;
    }

    // Format phone number for database
    const formattedPhone = formatToInternational(countryCode, phoneNo);

    mutation.mutate({
      customers: {
        name,
        phone: formattedPhone,
        birthday: formatDateForDatabase(birthday),
      },
      shopCode,
    });
  };

  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-auto">
        <CardHeader>
          <CardTitle className="flex gap-2 font-mono text-lg">
            {t("title")}
          </CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
          <CardAction>
            <Ticket size={40} />
          </CardAction>
        </CardHeader>
        {isSuccess ? (
          <CardContent className="space-y-4 pb-8">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <CircleCheck className="h-12 w-12 text-green-500" />
              <p className="mt-4 font-mono font-bold text-xl">
                {t("successTitle")}
              </p>
              <p className="mt-2 text-muted-foreground">
                {t("successSubtitle")}
              </p>
            </div>
            <Button
              type="button"
              className="w-full font-mono"
              onClick={() => setIsSuccess(false)}
            >
              {t("successButton")}
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="w-full space-y-2 py-2">
                <Label>{t("nameLabel")}</Label>
                <Input
                  placeholder={t("namePlaceholder")}
                  type="text"
                  className="text-foreground font-mono"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
              <InputStartSelectDemo
                value={countryCode}
                setValue={setCountryCode}
                phoneNo={phoneNo}
                setPhoneNo={setPhoneNo}
                disabled={mutation.isPending}
              />
              <div className="w-full py-2">
                <Label className="text-foreground text-sm font-medium">
                  {t("birthdayLabel")}
                </Label>
                <CalendarPickerInput
                  value={birthday}
                  onChange={setBirthday}
                  disabled={mutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  {t("birthdayHint")}
                </p>
              </div>

              <div className="flex-1 w-auto h-0.5 rounded bg-border shadow-sm" />
              <div className="w-full space-y-2 py-2">
                <Label>{t("cafeCodeLabel")}</Label>
                <div className="relative">
                  <Input
                    placeholder={t("cafeCodePlaceholder")}
                    type="text"
                    className="text-foreground font-mono"
                    value={shopCode}
                    onChange={(e) => setShopCode(removeSpaces(e.target.value))}
                    disabled={mutation.isPending}
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    <Key size={16} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <Label className="text-sm text-muted-foreground mb-2">
                {t("privacyText")}
              </Label>
              <Button
                type="submit"
                className="w-full font-mono"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? t("submitting") : t("submit")}
                <Send />
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </section>
  );
}

const InputStartSelectDemo = ({
  value,
  setValue,
  phoneNo,
  setPhoneNo,
  disabled = false,
}: {
  value: string;
  setValue: (v: string) => void;
  phoneNo: string;
  setPhoneNo: (v: string) => void;
  disabled?: boolean;
}) => {
  const t = useTranslations("claim");
  const id = useId();
  const [open, setOpen] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const country = countryCodes.find((c) => c.value === value);

    if (!country) return;

    // Extract only digits
    const digitsOnly = input.replace(/\D/g, "");

    // Check if digits exceed max length
    if (digitsOnly.length > country.maxLength) {
      return;
    }

    // Format as user types based on selected country
    const formatted = formatForDisplay(input, value);
    setPhoneNo(formatted);
  };

  return (
    <div className="w-full space-y-2 py-2">
      <Label htmlFor={id}>{t("phoneLabel")}</Label>
      <div className="flex rounded-md shadow-xs">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="rounded-r-none shadow-none focus-visible:z-1 w-[100px] justify-between"
              disabled={disabled}
            >
              {value
                ? countryCodes.find((code) => code.value === value)?.label
                : t("countryCodePlaceholder")}
              <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput
                placeholder={t("countryCodeSearchPlaceholder")}
                className="h-9"
                disabled={disabled}
              />
              <CommandList>
                <CommandEmpty>{t("countryCodeNotFound")}</CommandEmpty>
                <CommandGroup>
                  {countryCodes.map((code) => (
                    <CommandItem
                      key={code.value}
                      value={code.label}
                      onSelect={() => {
                        setValue(code.value);
                        // Reformat phone number when country changes
                        if (phoneNo) {
                          const formatted = formatForDisplay(
                            phoneNo.replace(/\D/g, ""),
                            code.value,
                          );
                          setPhoneNo(formatted);
                        }
                        setOpen(false);
                      }}
                      disabled={disabled}
                    >
                      {code.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === code.value ? "opacity-100" : "opacity-0",
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
          placeholder={t("phonePlaceholder")}
          className="-ms-px rounded-l-none text-foreground font-mono"
          value={phoneNo}
          onChange={handlePhoneChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
