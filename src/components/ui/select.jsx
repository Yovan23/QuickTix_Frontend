import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(
    ({ className, children, value, onChange, placeholder, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    className={cn(
                        "flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 cursor-pointer transition-all duration-200",
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" className="text-muted-foreground">
                            {placeholder}
                        </option>
                    )}
                    {children}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>
        )
    }
)
Select.displayName = "Select"

const SelectOption = React.forwardRef(({ className, ...props }, ref) => (
    <option
        ref={ref}
        className={cn("bg-background text-foreground", className)}
        {...props}
    />
))
SelectOption.displayName = "SelectOption"

export { Select, SelectOption }
