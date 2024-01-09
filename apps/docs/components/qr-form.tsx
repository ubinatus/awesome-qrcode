import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  defaultValues,
  ecLevelOptions,
  formSchema,
  type FormValues,
} from "@/lib/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { type AwesomeQRCodeProps } from "@awesome-qrcode/react";

type Props = {
  setOptions: (opts: AwesomeQRCodeProps) => void;
  isLoading: boolean;
};

export function QRForm({ setOptions, isLoading }: Props) {
  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  // Handler
  function onSubmit(values: FormValues) {
    setOptions(values);
  }
  // Mount
  useEffect(() => {
    void form.handleSubmit(onSubmit)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input placeholder="Enter your website or a text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="dataStyle"
            render={({ field }) => {
              return (
                <FormItem className="space-y-3 md:min-w-[180px]">
                  <FormLabel>QR style</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {["squares", "dots"].map((logo) => (
                        <FormItem
                          key={logo}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={logo} />
                          </FormControl>
                          <FormLabel className="font-normal">{logo}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="ecLevel"
            render={({ field }) => (
              <FormItem className="space-y-3 md:min-w-[180px]">
                <FormLabel>Error correction level</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {ecLevelOptions.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="bgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background color</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foreground color</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="logoImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-6 md:flex-row">
          <FormField
            control={form.control}
            name="eyeColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eye color</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eyeRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eye radius</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            disabled={isLoading}
            type="submit"
            className="min-w-[120px] !bg-primary hover:!bg-primary/90"
          >
            {isLoading ? <LoaderIcon className="animate-spin" /> : "Generate"}
          </Button>
          <div className="text-sm text-muted-foreground dark:text-muted">
            Simple usage of @awesome-qrcode/react.
            <div>
              Read{" "}
              <Button
                asChild
                variant="link"
                className="h-6 px-0 py-0 font-normal text-muted-foreground dark:text-muted"
              >
                <Link href="/docs">docs</Link>
              </Button>{" "}
              for more options
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
