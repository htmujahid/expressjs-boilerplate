import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';

const ajv = new Ajv({ $data: true, allErrors: true });
addFormats(ajv);
addKeywords(ajv, ['transform']);
ajvErrors(ajv);

export default ajv;
