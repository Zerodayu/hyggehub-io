"use client"

import { CheckIcon, ImagePlusIcon, XIcon } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PasswordInput from "./passInput"
import CalendarPickerInput from "./calendarPicker"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

const initialAvatarImage = [
  {
    name: "avatar-72-01.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "/avatar-72-01.jpg",
    id: "avatar-123456789",
  },
]

export default function EditProfileBtn() {
  const { user } = useUser()
  const username = user?.username || null
  const firstName = user?.firstName || null
  const lastName = user?.lastName || null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit profile</Button>
      </DialogTrigger>
      <DialogContent className="bg-opacity-20 backdrop-blur-xs flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a
          username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <ProfileBg />
          <Avatar />
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`first-name`}>First name</Label>
                  <Input
                    id={`first-name`}
                    placeholder="Firstname"
                    defaultValue={firstName || undefined}
                    type="text"
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`last-name`}>Last name</Label>
                  <Input
                    id={`last-name`}
                    placeholder="Lastname"
                    defaultValue={lastName || undefined}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`username`}>Username</Label>
                <div className="relative">
                  <Input
                    id={`username`}
                    className="peer pe-9"
                    placeholder="Username"
                    defaultValue={username || undefined}
                    type="text"
                    required
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    <CheckIcon
                      size={16}
                      className="text-emerald-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <div className="*:not-first:mt-2">
                <CalendarPickerInput />
              </div>
              <div className="*:not-first:mt-2">
                <Accordion type="single" collapsible className="w-full" defaultValue="3">
                    <AccordionItem value="" className="py-2">
                      <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                        <div className="flex flex-row justify-between items-center">
                          <p>Password</p>
                          <p>change password</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-2">
                        
                      </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <PasswordInput />
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ProfileBg() {
  const bgUrl = "https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,w_1100,h_800/v1718616188/articles/RP0001BW03W_interior2.jpg"

  return (
    <div className="h-32">
      <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
        <img
          className="size-full object-cover"
          src={bgUrl}
          alt="Profile background"
          width={512}
          height={96}
        />
      </div>
    </div>
  )
}

function Avatar() {
  const { user } = useUser()
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles: initialAvatarImage,
  })

  // Use Clerk user avatar if available, otherwise fallback to uploaded image
  const currentImage = user?.imageUrl || files[0]?.preview || null

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="size-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  )
}
