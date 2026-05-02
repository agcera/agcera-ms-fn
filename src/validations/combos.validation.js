import yup from '.';

export const comboCreateSchema = yup.object({
  name: yup.string().required(),
  costPrice: yup
    .number()
    .typeError('cost price must be a number')
    .min(0, 'cost price must be greater than or equal to 0')
    .required('cost price is a required field'),
  sellingPrice: yup
    .number()
    .typeError('selling price must be a number')
    .min(yup.ref('costPrice'), 'selling price must be greater than or equal to cost price')
    .required('selling price is a required field'),
  items: yup
    .array()
    .of(
      yup.object({
        productId: yup.string().required('Product selection is required'),
        number: yup.number().min(1).required(),
      })
    )
    .uniqueField('productId', 'No two or more items can have the same product')
    .min(1)
    .required(),
});

export const comboUpdateSchema = yup.object({
  name: yup.string(),
  costPrice: yup
    .number()
    .typeError('cost price must be a number')
    .min(0, 'cost price must be greater than or equal to 0'),
  sellingPrice: yup
    .number()
    .typeError('selling price must be a number')
    .min(yup.ref('costPrice'), 'selling price must be greater than or equal to cost price'),
  items: yup
    .array()
    .of(
      yup.object({
        productId: yup.string().required('Product selection is required'),
        number: yup.number().min(1).required(),
      })
    )
    .uniqueField('productId', 'No two or more items can have the same product')
    .min(1),
});
