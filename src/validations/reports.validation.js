import yup from '.';

export const generateReportSchema = yup.object().shape({
  from: yup.date().required(),
  to: yup.date().min(yup.ref('from')).required(),
  storeId: yup.string(),
});
