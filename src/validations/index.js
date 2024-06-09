import * as yup from 'yup';

yup.addMethod(yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, function (list) {
    return list?.length === new Set(list?.map(mapper)).size;
  });
});
yup.addMethod(yup.array, 'uniqueField', function (field, message, mapper = (a) => a) {
  return this.test('uniqueField', message, function (list) {
    const listNumbers = list.map((o) => o[field]);
    return listNumbers?.length === new Set(listNumbers?.map(mapper)).size;
  });
});

export default yup;
