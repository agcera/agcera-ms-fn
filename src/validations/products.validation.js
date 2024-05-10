import yup from '.';

export const productCreateSpecialSchema = yup.object({
  name: yup.string().required(),
  variations: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required('name is a required field'),
        description: yup.string(),
        costPrice: yup
          .number()
          .typeError('cost price must be a number')
          .min(0, 'cost price must be greater than or equal to 0')
          .required('cost price is a required field'),
        sellingPrice: yup
          .number()
          .typeError('cost price must be a number')
          .min(yup.ref('costPrice'), 'selling price must be greater than or equal to cost price')
          .required('selling price is a required field'),
      })
    )
    .min(1)
    .required(),
});

export const productCreateStandardSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  costPrice: yup
    .number()
    .typeError('cost price must be a number')
    .min(0, 'cost price must be greater than or equal to 0')
    .required('cost price is a required field'),
  sellingPrice: yup
    .number()
    .typeError('cost price must be a number')
    .min(yup.ref('costPrice'), 'selling price must be greater than or equal to cost price')
    .required('selling price is a required field'),
});

export const productUpdateSpecialSchema = yup.object({
  name: yup.string(),
  variations: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required('name is a required field'),
        description: yup.string(),
        costPrice: yup
          .number()
          .typeError('cost price must be a number')
          .min(0, 'cost price must be greater than or equal to 0')
          .required('cost price is a required field'),
        sellingPrice: yup
          .number()
          .typeError('cost price must be a number')
          .min(yup.ref('costPrice'), 'selling price must be greater than or equal to cost price')
          .required('selling price is a required field'),
      })
    )
    .min(1),
});

export const productUpdateStandardSchema = yup.object({
  name: yup.string(),
  description: yup.string(),
  costPrice: yup
    .number()
    .typeError('cost price must be a number')
    .min(0, 'cost price must be greater than or equal to 0')
    .required('cost price is a required field'),
  sellingPrice: yup
    .number()
    .typeError('cost price must be a number')
    .min(yup.ref('costPrice'), 'selling price must be greater than or equal to cost price')
    .required('selling price is a required field'),
});
