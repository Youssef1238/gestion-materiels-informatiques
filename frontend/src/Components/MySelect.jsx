import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function MySelect ({children , width , placeholder , ...props}){
    const [ContentWidth,setContentWidth] = useState()


    return (
        <Select  {...props}>
            <SelectTrigger className={width + " rounded-sm text-xs px-4 py-2 border select-text border-primary justify-between disabled:border-gray-300"}
                ref={(el) => {
                    if (el) {
                        
                        setContentWidth(`${el.offsetWidth}px`);
                    }
                }}
            >
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent style={{ width: ContentWidth }} className=" max-h-[50vh] p-0 m-0 z-50" >
                    {children}
            </SelectContent>
        </Select>
    )

}