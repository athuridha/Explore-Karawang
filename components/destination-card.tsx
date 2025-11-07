"use client"

import * as React from "react"
import Image from "next/image"
import { Check, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { DestinationProps } from "@/types"

export function DestinationCard({ title, description, image, location, googleMapsLink, facilities, bestTimeToVisit, entranceFee }: DestinationProps) {
  const [open, setOpen] = React.useState(false)

  const handleGetDirections = () => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank')
    }
  }

  // Default facilities jika tidak ada
  const displayFacilities = facilities && facilities.length > 0 
    ? facilities 
    : ["Parking", "Restrooms", "Food Stalls", "Souvenir Shop"]

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full mx-auto px-4 md:px-6">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105 duration-300"
            />
          </div>
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
            View Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {location}
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-64 w-full">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover rounded-md" />
          </div>
          <div className="space-y-4">
            <p>{description}</p>
            <div className="space-y-2">
              <h4 className="font-medium">Facilities:</h4>
              <ul className="grid grid-cols-2 gap-2">
                {displayFacilities.map((facility, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> {facility}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Best Time to Visit:</h4>
              {bestTimeToVisit ? (
                <p>{bestTimeToVisit}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Entrance Fee:</h4>
              {entranceFee ? (
                <p>{entranceFee}</p>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            {googleMapsLink ? (
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Directions
              </a>
            ) : (
              <Button className="bg-emerald-600" disabled>
                Get Directions
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
