import { z } from "zod";
import { Resolver } from "react-hook-form";

const sequentialResolver: (
  schema: z.ZodEffects<z.AnyZodObject>
) => Resolver<any> = (schema) => async (values, context, options) => {
  const result = schema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  } else {
    const errors: Record<string, any> = {};

    for (const issue of result.error.issues) {
      const path = issue.path[0];
      errors[path] = { type: "manual", message: issue.message };
      break;
    }

    return { values: {}, errors };
  }
};

export default sequentialResolver;
