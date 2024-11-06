export type ConverterFunc = (value: string) => unknown;

export function BooleanConverter(value?: string): boolean | undefined {
  if (!value || value == "") {
    return undefined;
  }

  if (value.toLowerCase() === "true" || (Number(value) > 0)) {
    return true;
  }

  if (value.toLocaleLowerCase() == "false" || Number(value) <= 0) {
    return false;
  }

  throw new Error("Could not convert value '" + value + "' to boolean.");
}

export function NumberConverter(value?: string): number | undefined {
  if (!value || value == "") {
    return undefined;
  }
  const nr = Number(value);
  if (!isNaN(nr)) {
    return nr;
  }
  throw new Error("Could not convert value '" + value + "' to number.");
}

export function DateConverter(value: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date;
}


export function createConverter(targetType: unknown): (value: string) => typeof targetType | undefined {
  if (typeof targetType === "number") {
    return NumberConverter;
  } else if (typeof targetType === "string") {
    return value => !value || value == "" ? undefined : value;
  } else if (typeof targetType === "boolean") {
    return BooleanConverter;
  } else if (targetType instanceof Date) {
    return DateConverter;
  } else {
    throw new Error("Unsupported type: " + typeof targetType);
  }
}

export function createConverterFromInputType(inputType: string): ConverterFunc {
  switch (inputType) {
    case "number":
      return NumberConverter;
    case "string":
    case "color":
      return value => !value || value == "" ? undefined : value;
  }
}

export function convertToType(type: "number" | "string" | "boolean" | "date", value: string): number | string | boolean | Date {
  switch (type) {
    case "number":
      return Number(value);
    case "string":
      return value;
    case "boolean":
      return value.toLowerCase() === "true" || (Number(value) > 0);

    case "date":
      {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format");
        }
        return date;
      }

    default:
      throw new Error("Unsupported type");
  }
}
