import yup from '.';

export const generateReportSchema = yup.object().shape({
  from: yup.date().required(),
  to: yup.date().min(yup.ref('from'), "to date can't be after the from date").required(),
  storeId: yup.string(),
});
