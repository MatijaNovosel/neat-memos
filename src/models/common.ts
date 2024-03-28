import { ComputedRef, Ref, ShallowRef } from "vue";

export interface QueryOptionSort {
  by?: string | undefined;
  descending?: boolean | undefined;
}

export interface PageableCollection<TResult> {
  results?: TResult[] | undefined;
  total?: number | undefined;
}

export interface IDataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
  sortDesc: boolean[];
  groupBy: string[];
  groupDesc: boolean[];
}

export interface IQueryOptions {
  skip: number;
  take: number;
  sort: QueryOptionSort[];
  group: QueryOptionSort[];
}

export interface FormFile {
  data: File | undefined;
  fileName: string | undefined;
}

export interface IVuetifyCalendar {
  next: () => void;
  prev: () => void;
  checkChange: () => void;
  title: string;
}

export interface IVuetifyCalendarEvent {
  name: string | null;
  start: Date;
  end: Date;
  color: string | null;
  timed: boolean;
  category?: string;
  data?: any;
}

export interface IValidationObserverForm {
  reset: () => void;
}

export interface DraggableDropEvent<T> {
  removedIndex: number;
  addedIndex: number;
  payload: T;
}

export interface KeyValuePair<A, B> {
  key: A;
  value: B;
}

type SelectItemKey =
  | boolean
  | string
  | (string | number)[]
  | ((item: Record<string, any>, fallback?: any) => any);

type DataTableCompareFunction<T = any> = (a: T, b: T) => number;

export interface VuetifyDataTableHeaderItem {
  key: string;
  value?: SelectItemKey;
  title: string;

  colspan?: number;
  rowspan?: number;

  fixed?: boolean;
  align?: "start" | "end" | "center";

  width?: number | string;
  minWidth?: string;
  maxWidth?: string;

  sortable?: boolean;
  sort?: DataTableCompareFunction;
}

export interface IDict<T> {
  [index: string]: T;
}

export interface IVuetifyForm {
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

export interface IGeography {
  coordinates: number[] | number[][] | number[][][];
  type: string;
}
