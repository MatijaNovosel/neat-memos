import { ComputedRef, Ref, ShallowRef } from "vue";

export interface IForm {
  errors: Ref<{ id: string | number; errorMessages: string[] }[]>;
  isDisabled: ComputedRef<boolean>;
  isReadonly: ComputedRef<boolean>;
  isValidating: ShallowRef<boolean>;
  isValid: Ref<boolean> & { externalValue: boolean };
  items: Ref<
    {
      id: string | number;
      validate: () => Promise<string[]>;
      reset: () => void;
      resetValidation: () => void;
      isValid: boolean;
      errorMessages: string[];
    }[]
  >;
  validate: () => Promise<{
    valid: boolean;
    errors: { id: string | number; errorMessages: string[] }[];
  }>;
  reset: () => void;
  resetValidation: () => void;
  resetForm: () => void;
}
