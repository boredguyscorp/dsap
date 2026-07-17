import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { UseFormProps } from "react-hook-form";
import type { ZodType } from "zod";

export function useZodForm<TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  },
) {
  const { schema, ...formProps } = props;

  const form = useForm<TSchema["_input"]>({
    ...formProps,
    resolver: zodResolver(schema, undefined),
  });

  useEffect(() => {
    form.control._options.resolver = zodResolver(schema, undefined);
  }, [schema, form.control]);

  return form;
}
