import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"



const PopOver = ({ trigger, content }: any) => {
    return (
        <Popover>
            <PopoverTrigger>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="w-fit mr-4">
                {content}
            </PopoverContent>
        </Popover>
    )
}

export default PopOver