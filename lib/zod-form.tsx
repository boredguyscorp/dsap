import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { UseFormProps } from "react-hook-form";
import type { z, ZodType } from "zod";

export function useZodForm<TSchema extends ZodType>(
  props: Omit<UseFormProps<z.infer<TSchema>>, "resolver"> & {
    schema: TSchema;
  },
) {
  const { schema, ...formProps } = props;

  const form = useForm<z.infer<TSchema>>({
    ...formProps,
    resolver: zodResolver(schema, undefined),
  });

  useEffect(() => {
    form.control._options.resolver = zodResolver(schema, undefined);
  }, [schema, form.control]);

  return form;
}
