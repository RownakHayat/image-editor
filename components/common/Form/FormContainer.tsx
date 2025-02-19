"use client"
import {
    Form,
} from "@/components/ui/form";

const FormContainer = ({ form, onSubmit, children }: any) => {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {children}
            </form>
        </Form>
    )
}

export default FormContainer