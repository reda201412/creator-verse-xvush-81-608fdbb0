
// Define custom FormData interface to support string indexing
export interface CustomFormData extends FormData {
  [key: string]: any;
}

// This allows us to use formData["mediaFile"] syntax
