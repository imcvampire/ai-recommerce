import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import generateContent, { type ContentResult } from '~/lib/generateContent'

const conditions = ['Good', 'Fair', 'Like-new']

const formSchema = z.object({
  productName: z.string().min(1),
  condition: z.enum(conditions),
  notes: z.string().min(1),
})

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      condition: '',
      notes: '',
    },
  })

  const [loading, setLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [result, setResult] = useState<ContentResult>()

  const marketingTextTextareaId = useId()
  const categoryTextareaId = useId()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    setHasResult(false)

    try {
      const result = await generateContent(values)
      setResult(result)
      setHasResult(true)
    } catch {
      toast.error(
        'Something went wrong. Please try again later or contact support if the problem persists. Thank you for your patience and understanding.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="iPhone 16" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={'w-full'}>
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {loading ? (
                <>
                  {' '}
                  <Loader2Icon className="animate-spin" />
                  <span>Please wait</span>
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </Form>
      </div>

      {!loading && hasResult && (
        <div className="mt-12 w-full max-w-sm space-y-8">
          <h3 className="text-2xl">Result</h3>

          <label htmlFor={marketingTextTextareaId}>Marketing text</label>
          <Textarea id={marketingTextTextareaId} readOnly defaultValue={result?.marketingText} />

          <label htmlFor={categoryTextareaId}>Category</label>
          <Textarea id={categoryTextareaId} readOnly defaultValue={result?.category} />
        </div>
      )}
    </div>
  )
}
