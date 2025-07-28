import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Building2, ChevronDown, Plus } from "lucide-react";
import type { Business } from "@shared/schema";

export default function CompanySwitcher() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const { data: businesses = [] } = useQuery({
    queryKey: ['/api/businesses'],
  });

  // Set default business if none selected and businesses are loaded
  if (!selectedBusiness && businesses.length > 0) {
    setSelectedBusiness(businesses[0]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[250px] justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">
              {selectedBusiness?.name || "Select Business"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]" align="start">
        <DropdownMenuLabel>Your Businesses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {businesses.map((business: Business) => (
          <DropdownMenuItem
            key={business.id}
            onClick={() => setSelectedBusiness(business)}
            className={selectedBusiness?.id === business.id ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{business.name}</span>
              <span className="text-xs text-muted-foreground">
                {business.businessType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {business.vatScheme !== 'not_registered' && ' • VAT Registered'}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="h-4 w-4 mr-2" />
          Add New Business
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
