import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const DialogComponent = ({ triggerContent, content, className, width, icon, triggerStyle }: any) => {
    return (
        <Dialog>
            <DialogTrigger className={`${triggerStyle} flex items-center gap-1 rounded `}>
                {icon} {triggerContent}
            </DialogTrigger>
            <DialogContent style={{ width: `${width || '80%'}`, maxWidth: 'none' }} className={`${className} w-full sm:max-w-md`}>
                {content}
            </DialogContent>
        </Dialog>
    );
};

export default DialogComponent;
